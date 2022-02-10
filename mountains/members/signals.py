from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from members.models import User


@receiver(post_save, sender=User)
def email_superusers_about_new_user(instance, **kwargs):
    if not instance.is_approved and instance.first_name and instance.last_name:
        email_body =  (
            f"New user {instance.first_name} {instance.last_name} ({instance.email}) needs approval!\n\n"
        )

        superusers = User.objects.filter(is_superuser=True)

        send_mail(
            "Clyde Mountaineering Club - New User needs approval",
            email_body,
            "noreply@clydemc.org",
            [u.email for u in superusers],
            fail_silently=True,
        )
