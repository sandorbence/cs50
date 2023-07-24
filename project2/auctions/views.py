from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required

from datetime import datetime

from .models import User, Listing, Bid, Comment


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = "__all__"


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = "__all__"


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CommentForm, self).__init__(*args, **kwargs)
        self.fields["text"].widget.attrs.update({
            "placeholder": "Leave a comment..."
        })


def index(request):
    if request.method == "POST":
        form = ListingForm(request.POST, request.FILES)
        form.pub_date = datetime.now()
        if form.is_valid():
            form.save()
        else:
            return render(request, "auctions/new-listing.html", {
                "form": form
            })
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
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
            if request.POST.get("next"):
                return redirect(request.POST.get("next"))
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        if request.GET.get("next"):
            return render(request, "auctions/login.html", {
                "next": request.GET.get("next")
            })
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


def listing(request, listing_id):
    if request.method == "POST":
        match request.POST.get("type"):
            case "bid":
                form = BidForm(request.POST)
                form.date = datetime.now()
                if form.is_valid():
                    form.save()
                else:
                    raise Exception("Your bid was invalid.")
            case "comment":
                form = CommentForm(request.POST)
                form.date = datetime.now()
                if form.is_valid():
                    form.save()
                else:
                    print(form.errors)
                    raise Exception("Something went wrong writing a comment.")
    listing = Listing.objects.get(pk=listing_id)
    bid_form = BidForm(
        initial={"user": request.user, "date": datetime.now(), "listing": listing})
    comment_form = CommentForm(
        initial={"user": request.user, "date": datetime.now(), "listing": listing})
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "form": bid_form,
        "comment_form": comment_form
    })


@login_required
def new_listing(request):
    form = ListingForm(
        initial={"user": request.user, "pub_date": datetime.now()})
    return render(request, "auctions/new-listing.html", {
        "form": form
    })


def user_profile(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/user-profile.html", {
        "user": user
    })
