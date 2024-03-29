# Generated by Django 4.2.3 on 2023-07-23 19:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_alter_bid_value_alter_listing_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='bid',
            name='listing',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bids', to='auctions.listing'),
        ),
        migrations.AddField(
            model_name='comment',
            name='listing',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='auctions.listing'),
        ),
    ]
