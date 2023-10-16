# Generated by Django 4.2.6 on 2023-10-15 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0009_listing_active_listing_winner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='category',
            field=models.CharField(blank=True, choices=[('other', 'Other'), ('hobbies', 'Hobbies'), ('sports', 'Sports'), ('gardening', 'Gardening'), ('home', 'Home'), ('fashion', 'Fashion'), ('toys', 'Toys'), ('electronics', 'Electronics')], max_length=50, null=True),
        ),
        migrations.DeleteModel(
            name='Category',
        ),
    ]
