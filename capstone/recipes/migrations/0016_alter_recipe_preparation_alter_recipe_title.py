# Generated by Django 4.2.3 on 2023-09-30 13:20

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0015_alter_ingredient_name_alter_ingredient_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='preparation',
            field=models.CharField(max_length=5000, validators=[django.core.validators.MaxLengthValidator(5000)]),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='title',
            field=models.CharField(max_length=100, validators=[django.core.validators.MaxLengthValidator(100)]),
        ),
    ]
