from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError

from datetime import datetime

from .models import User, Listing, Bid, Comment, Category, Watchlist


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ListingForm, self).__init__(*args, **kwargs)
        self.fields["photo"].widget.attrs.update({
            "id": "listing-image",
        })
        self.fields["description"].widget.attrs.update({
            "placeholder": "Begin typing your description...",
        })


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(BidForm, self).__init__(*args, **kwargs)
        self.fields["value"].widget.attrs.update({
            "placeholder": "How much is this worth for you?"
        })

    def clean_bid(self, highest_bid, bid_step):
        bid = self.cleaned_data["value"]
        if bid <= highest_bid:
            return "bid"
        elif bid < highest_bid + bid_step:
            return "bid_step"
        return bid


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
        form.user = request.user
        if form.is_valid():
            form.save()
        else:
            return render(request, "auctions/new-listing.html", {
                "form": form
            })
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.filter(active=True).all()
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
        listing = Listing.objects.get(id=listing_id)
        if listing.bids.all().exists():
            highest_bid = listing.bids.all().order_by("-value").first().value
        else:
            highest_bid = None
        if not request.user.is_authenticated:
            message = "Please sign in."
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "bid_form": BidForm(),
                "comment_form": CommentForm(),
                "message": message,
                "highest_bid": highest_bid
            })
        match request.POST.get("type"):
            case "bid":
                form = BidForm(request.POST)
                form.date = datetime.now()
                if form.is_valid():
                    if listing.bids.all().exists():
                        highest_bid = listing.bids.all().order_by("-value").first().value
                        bid_step = listing.bid_step
                        validate = form.clean_bid(highest_bid, bid_step)
                        if validate != form.cleaned_data["value"]:
                            if validate == "bid":
                                message = "Bid must be higher than existing highest bid."
                            else:
                                message = "Bid step not reached. The minimum bid must be $" + \
                                    str(bid_step) + " higher."
                            return render(request, "auctions/listing.html", {
                                "listing": listing,
                                "bid_form": form,
                                "comment_form": CommentForm(),
                                "message": message
                            })
                    form.save()
                else:
                    raise Exception("Your bid was invalid.")
                return redirect("listing", listing_id=listing_id)
            case "comment":
                form = CommentForm(request.POST)
                form.date = datetime.now()
                if form.is_valid():
                    form.save()
                else:
                    raise Exception("Something went wrong writing a comment.")
                return redirect("listing", listing_id=listing_id)
            case "watchlist":
                watchlist = Watchlist.objects.get(user=request.user)
                listing = listing
                if listing in watchlist.listings.all():
                    watchlist.listings.remove(listing)
                else:
                    watchlist.listings.add(listing)
                return redirect("listing", listing_id=listing_id)
    listing = Listing.objects.get(pk=listing_id)
    if listing.bids.all().exists():
        highest_bid = listing.bids.all().order_by("-value").first().value
    else:
        highest_bid = None
    bid_form = BidForm(
        initial={"user": request.user, "date": datetime.now(), "listing": listing})
    comment_form = CommentForm(
        initial={"user": request.user, "date": datetime.now(), "listing": listing})
    if request.user.is_authenticated:
        if not Watchlist.objects.filter(user=request.user).exists():
            Watchlist.objects.create(user=request.user)
        watchlist = Watchlist.objects.get(user=request.user)
    else:
        watchlist = None
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "bid_form": bid_form,
        "comment_form": comment_form,
        "watchlist": watchlist,
        "highest_bid": highest_bid
    })


@login_required
def new_listing(request):
    form = ListingForm(
        initial={"user": request.user, "pub_date": datetime.now()})
    return render(request, "auctions/new-listing.html", {
        "form": form
    })


@login_required
def watchlist(request):
    try:
        Watchlist.objects.get(user=request.user)
    except:
        Watchlist.objects.create(
            user=request.user,
        )
    return render(request, "auctions/watchlist.html", {
        "watchlist": Watchlist.objects.get(user=request.user)
    })


def user_profile(request, username):
    user = User.objects.get(username=username)
    return render(request, "auctions/user-profile.html", {
        "user": user,
        "visiting": request.user,
        "active_listings": Listing.objects.filter(user=user, active=True).all(),
        "closed_listings": Listing.objects.filter(user=user, active=False).all(),
        "won_listings": Listing.objects.filter(winner=user).exclude(user=user).all()
    })


def category(request, title):
    category = Category.objects.get(title=title)
    return render(request, "auctions/category.html", {
        "category": category,
        "listings": category.listings.filter(active=True).all()
    })


def categories(request):
    return render(request, "auctions/categories.html", {
        "categories": Category.objects.all().order_by("title").values()
    })


def close_listing(request, listing_id):
    listing = Listing.objects.get(id=listing_id)
    if listing.active:
        if not listing.bids.all().exists():
            listing.winner = request.user
        elif request.POST.get("buy") != None:
            listing.winner = request.user
        else:
            highest_bid = listing.bids.all().order_by("-value").first()
            user = highest_bid.user
            listing.winner = user
        listing.active = False
        listing.save()
    else:
        listing.active = True
        listing.winner = None
        listing.save()
    return redirect("listing", listing_id=listing_id)
