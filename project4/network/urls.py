
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:username>", views.user_profile, name="user_profile"),
    path("following", views.following, name="following"),

    # API routes
    path("users/<int:user_id>", views.user, name="user"),
    path("posts/<str:filter>", views.posts, name="posts")
]
