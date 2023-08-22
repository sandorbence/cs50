from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

import json
from datetime import datetime

from .models import User, Post


def index(request):

    if request.method == "POST":
        text = request.POST.get("text")

        if text == "":
            return JsonResponse({"error": "The post must have text."}, status=400)
        post = Post(
            user=request.user,
            text=text,
            date=datetime.now()
        )
        post.save()
        return redirect("index")

    posts = Post.objects.order_by("-date").all()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html", {
        "page_obj": page_obj
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def user(request, user_id):

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(user.serialize())

    if request.method == "PUT":
        followed = json.loads(request.body).get("follow")
        if followed:
            user.followers.add(request.user)
        else:
            if user.followers.filter(username=request.user.username).exists():
                user.followers.remove(request.user)
            else:
                return JsonResponse({"error": "You are not following this user."}, status=400)

        user.save()
        return HttpResponse(status=204)


@csrf_exempt
@login_required
def post(request, post_id):

    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(post.serialize())

    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("text") is not None:
            text = data["text"]
            if text == "":
                return JsonResponse({"error": "The post must have text."}, status=400)
            post.text = text
        if data.get("liked") is not None:
            liked = data["liked"]
            if liked:
                post.likes.add(request.user)
            else:
                if post.likes.filter(username=request.username).exists():
                    post.likes.remove(request.user)
                else:
                    return JsonResponse({"error": "You have not yet liked this post."}, status=400)
    post.save()
    return JsonResponse({"message": "Post edited successfully."}, status=201)


@csrf_exempt
@login_required
def posts(request, filter):

    match filter:
        case "all":
            posts = Post.objects.all()
        case "following":
            posts = Post.objects.filter(
                user__in=[user for user in request.user.following.all()])

    posts = posts.order_by("-date").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


@login_required
def user_profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(user=user).order_by("-date")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/profile.html", {
        "user": user,
        "followed": request.user.following.filter(username=username).exists(),
        "page_obj": page_obj
    })


@login_required
def following(request):
    posts = Post.objects.filter(
        user__in=[user for user in request.user.following.all()]).order_by("-date")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/following.html", {
        "page_obj": page_obj
    })
