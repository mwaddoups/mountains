# Generated by Django 3.2.11 on 2024-05-13 15:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Kit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text_id', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=500)),
                ('brand', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=50)),
                ('type', models.CharField(max_length=50)),
                ('purchased_on', models.DateField()),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('seller', models.CharField(max_length=100)),
                ('price', models.FloatField()),
                ('last_checked', models.DateField()),
                ('last_condition', models.CharField(max_length=50)),
                ('notes', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='KitBorrow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('kit', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='kit.kit')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
