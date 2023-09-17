from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

from .choices import CATEGORIES, ALLERGENS


class User(AbstractUser):
    pass


class Recipe(models.Model):
    uploader = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="recipes")
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="recipe-images", blank=True, null=True)
    preparation = models.CharField(max_length=5000)
    upload_date = models.DateTimeField(auto_now_add=True)
    prep_time = models.IntegerField(blank=True, null=True)
    total_time = models.IntegerField(blank=True, null=True)
    servings = models.IntegerField(blank=True, null=True)
    favorites = models.ManyToManyField(User, related_name="favorite_recipes")

    def serialize(self):
        return {
            "id": self.pk,
            "uploader": self.uploader.username,
            "title": self.title,
            "image": self.image.url if self.image else None,
            "preparation": self.preparation,
            "upload_date": self.upload_date.strftime("%a %H:%M  %y/%m/%d"),
            "ingredients": [ingredient.serialize() for ingredient in self.ingredients.all()],
            "prep_time": self.prep_time,
            "total_time": self.total_time,
            "servings": self.servings,
            "category": [category.serialize() for category in self.categories.all()],
            "allergens": [allergen.name for allergen in self.allergens.all()]
        }

    def clean(self):
        if not self.uploader or not self.title or not self.uploader or not self.preparation or not self.upload_date or not self.ingredients or self.prep_time > self.total_time:
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
        return f"For: {self.recipe.title} - {self.name}: {self.quantity}"


class Category(models.Model):
    name = models.CharField(
        max_length=30, choices=CATEGORIES, default="snacks", unique=True)
    recipes = models.ManyToManyField(Recipe, related_name="categories")

    def __str__(self):
        return self.name

    def serialize(self):
        return {
            "name": self.name,
            "recipes": [recipe.title for recipe in self.recipes.all()]
        }


class Allergen(models.Model):
    name = models.CharField(
        max_length=30, choices=ALLERGENS, blank=True, null=True, default=None, unique=True)
    recipes = models.ManyToManyField(Recipe, related_name="allergens")

    def __str__(self):
        return self.name
