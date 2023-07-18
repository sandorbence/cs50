from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.entry, name="entry"),
    path("edit", views.edit_entry, name="edit"),
    path("random", views.random_page, name="random"),
    path("save", views.save_entry, name="save"),
    path("search", views.search, name="search")
]
