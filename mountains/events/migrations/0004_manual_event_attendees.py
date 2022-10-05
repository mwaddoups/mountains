# Handwritten from https://docs.djangoproject.com/en/4.1/howto/writing-migrations/

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0003_event_show_popup'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql='ALTER TABLE events_event_attendees RENAME TO events_attendinguser',
                    reverse_sql='ALTER TABLE events_attendinguser RENAME TO events_event_attendees',
                )
            ],
            state_operations=[
                migrations.CreateModel(
                    name='AttendingUser',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                        ('event', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='events.Event')),
                    ]
                ),
                migrations.AlterField(
                    model_name='event',
                    name='attendees',
                    field=models.ManyToManyField(
                        to=settings.AUTH_USER_MODEL,
                        through='events.AttendingUser'
                    )
                )
            ]
        ),
        migrations.AddField(
            model_name='attendinguser',
            name='is_waiting_list',
            field=models.BooleanField(default=False),
        )
    ]
