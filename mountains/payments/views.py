from django.shortcuts import redirect
import stripe
import stripe.error
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, viewsets
from members.permissions import IsCommittee
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from members.models import User
from .models import MembershipPrice
from .serializers import MembershipPriceSerializer

stripe.api_key = "sk_test_51OYx3RHeSU2riQUJ7HfIwdzw7X7bVz2qzGbDd7ClgJOkoIAYECXMVXTVwD6CMrmfu2eJ3TlcPK8XkjcvBIJriOAH00qtp0QAV0"
WEBHOOK_SECRET = (
    "whsec_1aec727bacac0c0b5406a9d4270b0f8f494bf64bc3aaa6d4dbffb8358f1c9e3b"
)


class ProductViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser | IsCommittee]

    def list(self, request):
        # Nest the products under the prices
        prices = stripe.Price.list(active=True)["data"]
        products = stripe.Product.list()["data"]

        for price in prices:
            matching_products = [p for p in products if p["id"] == price["product"]]
            price["product"] = matching_products[0]
        return Response(prices)

    def retrieve(self, request, pk=None):
        price = stripe.Price.retrieve(id=pk)
        product = stripe.Product.retrieve(id=price["product"])

        # Nest the product here
        price["product"] = product

        return Response(price)


class MemberJoinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_data = request.data

        try:
            price_id = user_data["price_id"]
            domain = user_data["return_domain"]
            user_data["member_id"] = request.user.id
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price": price_id,
                        "quantity": 1,
                    },
                ],
                mode="payment",
                success_url=domain + "?success=true",
                cancel_url=domain + "?canceled=true",
                metadata=user_data,
            )
        except Exception as e:
            raise e

        # TODO: Edit and send emails
        return Response(checkout_session.url)


def send_joining_emails(user_data):
    # Send email to member
    email_body = (
        "Thank you for joining!\n\n"
        "Your membership on the website should now be confirmed.\n\n"
        "The treasurer will ensure your membership is set up on Discord, and will register you for Mountaineering Scotland as soon as they are able. \n\n"
        "Thank you!"
    )
    email_html = "\n".join(["<p>" + line + "</p>" for line in email_body.split("\n")])

    send_mail(
        "Clyde Mountaineering Club - Joining details",
        email_body,
        "treasurer@clydemc.org",
        [user_data["email"]],
        fail_silently=True,
        html_message=email_html,
    )

    # Send email to treasurer
    email_body = (
        "A new user has paid to join the club!\n\n"
        + "See their details below:\n\n"
        + "\n".join([f"{k}: {v}" for k, v in user_data.items()])
        + "\n\nMake sure to add them to MS and Discord!"
    )
    email_html = "\n".join(["<p>" + line + "</p>" for line in email_body.split("\n")])

    send_mail(
        "Clyde Mountaineering Club - New paid member!",
        email_body,
        "noreply@clydemc.org",
        ["committee@clydemc.org"],
        fail_silently=True,
        html_message=email_html,
    )


def send_error_email(line_item):
    email_body = (
        "Received unknown payment! Check Stripe for more details.\n\n"
        + "See raw details below:\n\n"
        + "\n".join([f"{k}: {v}" for k, v in line_item["data"].items()])
        + "\n\nMake sure to add them to MS and Discord!"
    )
    email_html = "\n".join(["<p>" + line + "</p>" for line in email_body.split("\n")])

    send_mail(
        "Clyde Mountaineering Club - Unknown payment!",
        email_body,
        "noreply@clydemc.org",
        ["admin@clydemc.org", "treasurer@clydemc.org"],
        fail_silently=True,
        html_message=email_html,
    )


@csrf_exempt
def handle_order(request: HttpRequest):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = stripe.checkout.Session.retrieve(
            event["data"]["object"]["id"],
            expand=["line_items"],
        )

        line_items = session.line_items

        membership_ids = [p.price_id for p in MembershipPrice.objects.all()]

        for item in line_items:
            if item["price"]["id"] in membership_ids:
                # They've paid for membership - let's handle it!
                user_data = session.metadata

                # Set paid to true
                member = User.objects.get(id=user_data["member_id"])
                member.is_paid = True
                member.save()

                send_joining_emails(user_data)
            else:
                send_error_email(item)

    return HttpResponse(status=200)


class MembershipPriceViewSet(viewsets.ModelViewSet):
    queryset = MembershipPrice.objects.all()
    permission_classes = [permissions.IsAdminUser | IsCommittee]
    serializer_class = MembershipPriceSerializer
