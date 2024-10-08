# Generated by Django 3.2.11 on 2024-08-24 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kit', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='kit',
            name='added_on',
        ),
        migrations.AlterField(
            model_name='kit',
            name='brand',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='color',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='description',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='last_checked',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='last_condition',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='price',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='purchased_on',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='seller',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='text_id',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='kit',
            name='type',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
