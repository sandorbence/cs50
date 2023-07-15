from django.shortcuts import render, redirect
from django import forms

from . import util

from markdown2 import Markdown


class NewEntryForm(forms.Form):
    title = forms.CharField(label="Title of entry")
    text = forms.CharField(label="", widget=forms.Textarea(
        attrs={"placeholder": "Begin typing your wiki entry"}))


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def new_entry(request):
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            util.save_entry(
                form.cleaned_data["title"],
                form.cleaned_data["text"])
            return redirect('entry', title=form.cleaned_data["title"])
    return render(request, "encyclopedia/new-entry.html", {
        "form": NewEntryForm()
    })


def entry(request, title):
    markdown_converter = Markdown()
    try:
        entry_converted = markdown_converter.convert(util.get_entry(title))
    except:
        return render(request, "404.html", {
            "title": title.capitalize()
        })
    return render(request, "encyclopedia/entry.html", {
        "title": title.capitalize(),
        "entry": entry_converted
    })
