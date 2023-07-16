from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("new", views.new_entry, name="newentry"),
    path("wiki/<str:title>", views.entry, name="entry"),
    path("search", views.search, name="search")
]
