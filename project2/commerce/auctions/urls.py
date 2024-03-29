from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("listing/<int:listing_id>", views.listing, name="listing"),
    path("new-listing", views.new_listing, name="new-listing"),
    path("user/<str:username>", views.user_profile, name="user"),
    path("category/<str:title>", views.category, name="category"),
    path("categories", views.categories, name="categories"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("listing/<int:listing_id>/close", views.close_listing, name="close")
]
