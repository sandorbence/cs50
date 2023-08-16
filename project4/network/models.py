from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following")

    def serialize(self):
        return {
            "id": self.pk,
            "username": self.username,
            "email": self.email,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [followed.username for followed in self.following.all()]
        }


class Post(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posts")
    text = models.CharField(max_length=500)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"post by {self.user.username}: {self.text[:40]}"

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.username,
            "text": self.text,
            "date": self.date
        }
