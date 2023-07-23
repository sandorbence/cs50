from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Listing(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=120)
    price = models.FloatField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="listings")
    pub_date = models.DateTimeField("date published")
    photo = models.ImageField(upload_to="listing-images", blank=True)

    def __str__(self):
        return self.title


class Bid(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bids")
    date = models.DateTimeField("date of bid")
    value = models.FloatField()


class Comment(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comments")
    date = models.DateTimeField("date of comment")
    text = models.CharField(max_length=120)
