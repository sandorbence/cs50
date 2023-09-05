from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.


class User(AbstractUser):
    pass


class Recipe(models.Model):
    uploader = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipes")
    title = models.CharField(max_length=50)
    image = models.ImageField(upload_to="recipe-images", blank=True, null=True)
    preparation = models.CharField(max_length=2500)
    upload_date = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.pk,
            "uploader": self.uploader.username,
            "title": self.title,
            "image": self.image.url if self.image else None,
            "preparation": self.preparation,
            "upload_date": self.upload_date.strftime("%a %H:%M  %y/%m/%d"),
            "ingredients": [ingredient.serialize() for ingredient in self.ingredients.all()]
        }

    def clean(self):
        if not self.uploader or not self.title or not self.uploader or not self.preparation or not self.upload_date or not self.ingredients:
            raise ValidationError("Recipe data is not correct.")


    def __str__(self):
        return self.title

class Ingredient(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=40)
    quantity = models.CharField(max_length=40)

    def serialize(self):
        return {
            "name": self.name,
            "quantity": self.quantity
        }

    def clean(self):
        if not self.recipe or not self.name or not self.quantity:
            raise ValidationError("Ingredient data is not correct.")
        
    def __str__(self):
        return f"{self.name}: {self.quantity}"
