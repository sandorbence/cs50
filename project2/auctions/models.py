from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Category(models.Model):
    title = models.CharField(max_length=30)

    def __str__(self):
        return self.title


class Listing(models.Model):
    active = models.BooleanField(default=True)
    bid_step = models.FloatField(default=0.1)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="listings", blank=True, null=True)
    description = models.TextField(max_length=300)
    photo = models.ImageField(
        upload_to="listing-images", blank=True, null=True)
    price = models.FloatField()
    pub_date = models.DateTimeField("date published")
    title = models.CharField(max_length=20)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="listings")
    winner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="won_listings", blank=True, null=True)

    def __str__(self):
        return self.title


class Bid(models.Model):
    date = models.DateTimeField("date of bid")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="bids", blank=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bids")
    value = models.FloatField()

    def __str__(self):
        return f"${self.value}"


class Comment(models.Model):
    date = models.DateTimeField("date of comment")
    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="comments", blank=True, null=True)
    text = models.CharField(max_length=120)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return self.text[:20]


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listings = models.ManyToManyField(Listing, related_name="watchlisted_by")

    def __str__(self):
        return f"{self.user.username}'s watchlist"
