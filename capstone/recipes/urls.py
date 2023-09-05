from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("", views.index, name="index"),
    path("new", views.add_recipe, name="new"),
    path("recipe/<int:recipe_id>", views.recipe, name="recipe")
]
