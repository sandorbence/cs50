# Generated by Django 4.2.3 on 2023-09-05 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='prep_time',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='total_time',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
