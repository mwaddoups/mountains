from django.db.models.signals import pre_save
from django.dispatch import receiver
from events.models import AttendingUser
from activity.models import Activity


@receiver(pre_save, sender=AttendingUser)
def log_waiting_list_change(instance: AttendingUser, **kwargs):
    try:
        old_instance = AttendingUser.objects.get(pk=instance.id)  # type: ignore | this has id
        if instance.is_waiting_list != old_instance.is_waiting_list:
            if instance.is_waiting_list:
                Activity.objects.create(
                    user=instance.user,
                    event=instance.event,
                    action="was moved to waiting list for",
                )
            else:
                Activity.objects.create(
                    user=instance.user,
                    event=instance.event,
                    action="was moved to attending for",
                )
    except AttendingUser.DoesNotExist:
        pass
