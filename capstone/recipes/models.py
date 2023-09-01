from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    pass


class Recipe(models.Model):
    uploader = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipes")
    image = models.ImageField(upload_to="recipe-images", blank=True, null=True)
    preparation = models.CharField(max_length=2500)
    upload_date = models.DateTimeField(auto_now_add=True)


class Ingredient(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=40)
    quantity = models.CharField(max_length=40)
