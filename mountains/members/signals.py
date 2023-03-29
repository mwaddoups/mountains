from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from members.models import User


@receiver(post_save, sender=User)
def email_superusers_about_new_user(instance, **kwargs):
    if not instance.is_approved and instance.first_name and instance.last_name:
        email_body =  (
            f"New user {instance.first_name} {instance.last_name} ({instance.email}) has been auto-approved!\n\n"
        )

        instance.is_approved = True
        instance.save()

        superusers = User.objects.filter(is_superuser=True)

        send_mail(
            "Clyde Mountaineering Club - New User",
            email_body,
            "noreply@clydemc.org",
            ["admin@clydemc.org"],
            fail_silently=True,
        )
