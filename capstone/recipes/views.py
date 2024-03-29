from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, transaction
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django import forms
from django.core.paginator import Paginator

from .models import User, Recipe, Ingredient, Allergen

from .choices import UNITS, UNITS_METRIC, UNITS_IMPERIAL, ALLERGENS

import json


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ["category"]


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

        # If user tries to register without filling all data
        if not username or not email:
            return render(request, "recipes/register.html", {
                "message": "Please fill out email and username."
            })

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        # Ensure password is not an empty string
        if password == "":
            return render(request, "recipes/register.html", {
                "message": "Please fill out password."
            })
        # Ensure password matches confirmation
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


# Home page
def index(request):
    recipes = Recipe.objects.all().order_by("-upload_date")
    favorites = request.user.favorite_recipes.all(
    ) if request.user.is_authenticated else None
    pages = max(1, (recipes.count()/8).__ceil__())

    return render(request, "recipes/list-view.html", {
        "title": "All recipes",
        "recipes": recipes,
        "pages": pages,
        "favorites": favorites,
        "categories": CategoryForm(),
        "allergens": ALLERGENS
    })


# View for creating a new recipe
@login_required
def add_recipe(request):
    return render(request, "recipes/new.html", {
        "title": "Add a new recipe",
        "units": UNITS,
        "units_metric": UNITS_METRIC,
        "units_imperial": UNITS_IMPERIAL,
        "max_characters": Recipe._meta.get_field("preparation").max_length,
        "categories": CategoryForm(),
        "allergens": ALLERGENS
    })


# View for displaying a specific recipe
def recipe_site(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return render(request, "recipes/404.html", {
            "id": recipe_id
        })
    favorites = request.user.favorite_recipes.all(
    ) if request.user.is_authenticated else None
    steps = recipe.preparation.split("-step-")[1:]
    return render(request, "recipes/recipe.html", {
        "recipe": recipe,
        "favorites": favorites,
        "steps": steps,
        "referrer_url": request.META.get("HTTP_REFERER")
    })


# View dor displaying favorite recipes
@login_required
def favorites(request):
    recipes = request.user.favorite_recipes.all().order_by("-upload_date")
    pages = max(1, (recipes.count()/8).__ceil__())

    return render(request, "recipes/list-view.html", {
        "title": "Favorite recipes",
        "recipes": recipes,
        "pages": pages,
        "favorites": recipes,
        "categories": CategoryForm(),
        "allergens": ALLERGENS
    })


# View for displaying the user's own recipes
@login_required
def my_recipes(request):
    recipes = Recipe.objects.filter(
        uploader=request.user).order_by("-upload_date")
    pages = max(1, (recipes.count()/8).__ceil__())

    return render(request, "recipes/list-view.html", {
        "title": "My recipes",
        "recipes": recipes,
        "pages": pages,
        "categories": CategoryForm(),
        "allergens": ALLERGENS
    })


# View for editing a recipe
# Renders the same html as when creating one
@login_required
def edit_recipe(request, recipe_id):
    recipe = Recipe.objects.get(pk=recipe_id)

    if request.POST.get("method") == "edit":
        return render(request, "recipes/new.html", {
            "title": "Edit recipe",
            "recipe": recipe,
            "units": UNITS,
            "units_metric": UNITS_METRIC,
            "units_imperial": UNITS_IMPERIAL,
            "max_characters": Recipe._meta.get_field("preparation").max_length,
            "categories": CategoryForm(),
            "allergens": ALLERGENS
        })
    else:
        redirect = request.POST.get("redirect")
        recipe.delete()
        return HttpResponseRedirect(redirect)


# API endpoint for creating and editing recipes
@csrf_exempt
def recipe(request, recipe_id=None):
    if request.method == "POST":
        data = request.POST
        title = data.get("title")
        preparation = json.loads(data.get("preparation"))
        ingredients = json.loads(data.get("ingredients"))
        prep_time = data.get("preptime")
        total_time = data.get("totaltime")
        servings = data.get("servings")
        category = data.get("category")
        image = request.FILES.get("image")

        # Allergens can be left empty
        try:
            allergens = json.loads(data.get("allergens"))
        except:
            allergens = None

        # No ID means we are creating a new recipe
        if recipe_id == None:
            try:
                # Recipes won't be saved before validating other data
                with transaction.atomic():
                    recipe = Recipe.objects.create(
                        uploader=request.user, title=title, preparation=preparation, category=category,
                        image=image, prep_time=prep_time, total_time=total_time, servings=servings)

                    for ingredient in ingredients:
                        Ingredient.objects.create(
                            recipe=recipe, name=ingredient["name"], quantity=ingredient["quantity"])

                    if allergens is not None:
                        for allergen_name in allergens:
                            # At this point all allergens should have been already created
                            # by running the necessary command, so this is only for safety
                            allergen, _ = Allergen.objects.get_or_create(
                                name=allergen_name)
                            allergen.recipes.add(recipe)
            except ValidationError as e:
                return JsonResponse({"error": str(e)}, status=400)
            return redirect("index")

        # If it's an edit and not a new recipe
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
        except Recipe.DoesNotExist:
            return JsonResponse({"error": "Recipe not found."}, status=404)

        recipe.title = title
        recipe.preparation = preparation
        recipe.prep_time = prep_time
        recipe.total_time = total_time
        recipe.servings = servings
        recipe.category = category
        ingredients = ingredients
        if image:
            recipe.image = image
        else:
            recipe.image.delete(save=True)

        recipe.save()

        # Delete the ingredients for the recipe then add the new ones
        Ingredient.objects.filter(recipe=recipe).delete()
        for ingredient in ingredients:
            Ingredient.objects.create(
                recipe=recipe, name=ingredient["name"], quantity=ingredient["quantity"])

        # Delete the allergens for the recipe then add the new ones
        recipe.allergens.clear()
        if allergens is not None:
            for allergen_name in allergens:
                allergen, _ = Allergen.objects.get_or_create(
                    name=allergen_name)
                allergen.recipes.add(recipe)

        return redirect("my_recipes")

    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe not found."}, status=404)

    # Edit only the favorite field of a recipe
    if request.method == "PATCH":
        data = json.loads(request.body)
        favorite = data.get("favorite")

        if favorite is not None:
            if favorite:
                recipe.favorites.add(request.user)
            else:
                if recipe.favorites.filter(username=request.user.username).exists():
                    recipe.favorites.remove(request.user)
                else:
                    return JsonResponse({"error": "You have not yet added this recipe to favorites."}, status=400)
            recipe.save()
            return JsonResponse({"message": "Recipe edited successfully."}, status=201)

    if request.method == "GET":
        return JsonResponse(recipe.serialize())


# API endpoint for filtering recipes
# Returns IDs of recipes that match the criteria
def filter_recipes(request):
    filter_criteria = request.GET
    search_bar = filter_criteria.get("searchbar")
    category = filter_criteria.get("category")
    allergens = filter_criteria.get("allergens").split(',')[:-1]

    recipes = Recipe.objects.filter(title__icontains=search_bar)
    if category != "all":
        recipes = recipes.filter(category=category)
    recipes = recipes.exclude(allergens__name__in=allergens)

    recipe_ids = ""
    for recipe in recipes:
        recipe_ids += f"{recipe.pk},"

    return JsonResponse({"message": recipe_ids}, status=200)
