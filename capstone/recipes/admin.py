from django.contrib import admin

from .models import User, Recipe, Ingredient, Category, Allergen
# Register your models here.

admin.site.register(User)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Category)
admin.site.register(Allergen)