from members.discord import set_member_role
import stripe
import stripe.error
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, viewsets
from members.permissions import IsCommittee
from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from members.models import User
from events.models import Event, AttendingUser
from .models import MembershipPrice
from .serializers import MembershipPriceSerializer
from stripe import SignatureVerificationError
from pprint import pformat

stripe.api_key = settings.STRIPE_API_KEY
WEBHOOK_SECRET = settings.STRIPE_WEBHOOK_SECRET


class ProductViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser | IsCommittee]

    def list(self, request):
        # Nest the products under the prices
        prices = stripe.Price.list(active=True, limit=100).data
        products = stripe.Product.list().data

        for price in prices:
            matching_products = [p for p in products if p.id == price.product]
            price["product"] = matching_products[0]
        return Response(prices)

    def retrieve(self, request, pk=None):
        assert pk is not None
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

        return Response(checkout_session.url)


class EventPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_data = request.data

        try:
            assert "au_id" in user_data
            price_id = user_data["price_id"]
            domain = user_data["return_domain"]
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

        return Response(checkout_session.url)


def send_joining_emails(user_data):
    # Send email to member
    email_body = (
        "Thank you for joining!\n\n"
        "Your membership on the website should now be confirmed.\n\n"
        "Your membership should shortly be set up on Discord, and the treasurer will register you for Mountaineering Scotland as soon as they are able. \n\n"
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


def send_error_email(session: stripe.checkout.Session, line_item: stripe.LineItem):
    email_body = (
        "Received unknown payment! Check Stripe for more details.\n\n"
        + "See raw details below:\n\n"
        + pformat(session)
        + pformat(line_item)
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
    except SignatureVerificationError as e:
        # Invalid signature
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = stripe.checkout.Session.retrieve(
            event["data"]["object"]["id"],
            expand=["line_items"],
        )

        if session.line_items is None:
            line_items = []
        else:
            line_items = session.line_items

        membership_ids = {
            p.price_id: p.expiry_date for p in MembershipPrice.objects.all()
        }
        event_ids_to_event = {
            e.price_id for e in Event.objects.exclude(price_id__isnull=True)
        }

        for item in line_items:
            if (membership_id := item["price"]["id"]) in membership_ids:
                # They've paid for membership - let's handle it!
                user_data = session.metadata
                if user_data is not None:
                    expiry_date = membership_ids[membership_id]
                    member = User.objects.get(id=user_data["member_id"])

                    # This code is replicated from somewhere else
                    member.membership_expiry = expiry_date
                    member.save()

                    # Set discord member
                    if member.discord_id is not None:
                        set_member_role(member.discord_id)

                    send_joining_emails(user_data)
            elif item["price"]["id"] in event_ids_to_event:
                # They've paid for an event, let's handle it
                user_data = session.metadata
                if user_data is not None:
                    att_user = AttendingUser.objects.get(id=user_data["au_id"])
                    att_user.is_trip_paid = True
                    att_user.save()
            else:
                send_error_email(session, item)

    return HttpResponse(status=200)


class MembershipPriceViewSet(viewsets.ModelViewSet):
    queryset = MembershipPrice.objects.all()
    permission_classes = [permissions.IsAdminUser | IsCommittee]
    serializer_class = MembershipPriceSerializer
