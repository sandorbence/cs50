from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError, transaction
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django import forms

from .models import User, Recipe, Ingredient, Category, Allergen

from .choices import UNITS, UNITS_METRIC, UNITS_IMPERIAL, ALLERGENS

import json


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = "__all__"


# Code copied from project2


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            if request.POST.get("next"):
                return redirect(request.POST.get("next"))
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "recipes/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        # Redirect user to previously requested page
        if request.GET.get("next"):
            return render(request, "recipes/login.html", {
                "next": request.GET.get("next")
            })
        return render(request, "recipes/login.html")

# Code copied from project2


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

# Code copied from project2


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "recipes/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "recipes/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "recipes/register.html")


def index(request):
    recipes = Recipe.objects.all().order_by("-upload_date")
    favorites = request.user.favorite_recipes.all(
    ) if request.user.is_authenticated else None
    return render(request, "recipes/index.html", {
        "recipes": recipes,
        "favorites": favorites
    })


@csrf_exempt
def recipe(request, recipe_id):
    if request.method == "POST":
        data = request.POST
        title = data.get("title")
        preparation = json.loads(data.get("preparation"))
        ingredients = json.loads(data.get("ingredients"))
        prep_time = data.get("preptime")
        total_time = data.get("totaltime")
        servings = data.get("servings")
        category = data.get("category")
        try:
            # This can be empty
            allergens = json.loads(data.get("allergens"))
        except:
            allergens = None

        image = request.FILES.get("image")

        try:
            # Recipes won't be saved before validating other data
            with transaction.atomic():
                recipe = Recipe.objects.create(
                    uploader=request.user, title=title, preparation=preparation,
                    image=image, prep_time=prep_time, total_time=total_time, servings=servings)

                for ingredient in ingredients:
                    Ingredient.objects.create(
                        recipe=recipe, name=ingredient["name"], quantity=ingredient["quantity"])

                cat, _ = Category.objects.get_or_create(name=category)
                cat.recipes.add(recipe)

                if allergens is not None:
                    for allergen_name in allergens:
                        allergen, _ = Allergen.objects.get_or_create(
                            name=allergen_name)
                        allergen.recipes.add(recipe)
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)
        return redirect('index')

    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe not found."}, status=404)

    if request.method == 'PUT':
        favorite = json.loads(request.body).get("favorite")
        if favorite:
            recipe.favorites.add(request.user)
        else:
            if recipe.favorites.filter(username=request.user.username).exists():
                recipe.favorites.remove(request.user)
            else:
                return JsonResponse({"error": "You have not yet added this recipe to favorites."}, status=400)
        recipe.save()
        return JsonResponse({"message": "Recipe edited successfully."}, status=201)


def add_recipe(request):
    return render(request, "recipes/new.html", {
        "units": UNITS,
        "units_metric": UNITS_METRIC,
        "units_imperial": UNITS_IMPERIAL,
        "max_characters": Recipe._meta.get_field("preparation").max_length,
        "categories": CategoryForm(),
        "allergens": ALLERGENS
    })


def recipe_site(request, recipe_id):
    recipe = Recipe.objects.get(pk=recipe_id)
    steps = recipe.preparation.split("-step-")[1:]
    return render(request, "recipes/recipe.html", {
        "recipe": recipe,
        "steps": steps,
        "referrer_url": request.META.get("HTTP_REFERER")
    })


def favorites(request):
    recipes = request.user.favorite_recipes.all().order_by("-upload_date")
    return render(request, "recipes/favorite.html", {
        "recipes": recipes,
        "favorites": recipes
    })


def my_recipes(request):
    recipes = Recipe.objects.filter(uploader=request.user)
    return render(request, "recipes/my_recipes.html", {
        "recipes": recipes
    })


def edit_recipe(request, recipe_id):
    recipe = Recipe.objects.get(pk=recipe_id)

    if request.POST.get("method") == "edit":
        return render(request, "recipes/new.html", {
            "recipe": recipe.serialize()
        })
    else:
        redirect = request.POST.get("redirect")
        recipe.delete()
        return HttpResponseRedirect(redirect)
