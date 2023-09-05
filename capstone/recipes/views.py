from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError

from .models import User, Recipe, Ingredient

import json

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
    return render(request, "recipes/index.html", {
        "recipes": recipes
    })


@csrf_exempt
def add_recipe(request):

    if request.method == "POST":
        data = json.loads(request.body)
        title = data.get("title")
        preparation = data.get("preparation")
        ingredients = data.get("ingredients")
        #image = request.FILES.get("image")

        try:
            recipe = Recipe.objects.create(
                uploader=request.user, title=title, preparation=preparation)
            for ingredient in ingredients:
                Ingredient.objects.create(
                    recipe=recipe, name=ingredient["name"], quantity=ingredient["quantity"])
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=400)

    units = [
        "pinch",
        "csp",
        "tsp",
        "tbsp",
        "cup",
        "mug"
    ]
    units_metric = [
        "ml",
        "dl",
        "l",
        "g",
        "kg",
    ]
    units_imperial = [
        "pt",
        "qt",
        "gal",
        "oz",
        "lb"
    ]
    return render(request, "recipes/new.html", {
        "units": units,
        "units_metric": units_metric,
        "units_imperial": units_imperial
    })
