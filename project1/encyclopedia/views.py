from django.shortcuts import render, redirect
from django import forms

from . import util

from markdown2 import Markdown

from random import Random

class EntryForm(forms.Form):
    title = forms.CharField(label="Title of wiki page",  widget=forms.TextInput(attrs={"placeholder": "Title of entry"}))
    text = forms.CharField(label="", widget=forms.Textarea(
        attrs={"placeholder": "Begin typing your wiki entry"}))
    method = forms.CharField(widget=forms.HiddenInput(), required=False)


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def save_entry(request):
    if request.method == "POST":
        form = EntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            text = form.cleaned_data["text"]
            if form.cleaned_data["method"] == "edit":
                # Without encode() saving adds extra blank lines 
                util.save_entry(title, text.encode())
                return redirect("entry", title=title)
            elif title.lower() not in (entry.lower() for entry in util.list_entries()):
                util.save_entry(title, text.encode())
                return redirect("entry", title=title)
            else:
                raise Exception("Wiki page with that title already exists.")


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


def search(request):
    if request.method == "POST":
        query = request.POST.get("q")
        entries = util.list_entries()
        matches = []
        for entry in entries:
            if query.lower() == entry.lower():
                return redirect("entry", title=query)
            if query.lower() in entry.lower():
                matches.append(entry)
        return render(request, "encyclopedia/search.html", {
            "query": query,
            "matches": matches
        })
    

def edit_entry(request):
    if request.method == "POST":
        form = EntryForm({"title": request.POST.get("title"), "text": util.get_entry(request.POST.get("title")), "method": "edit"})
        return render(request, "encyclopedia/edit-entry.html", {
            "form": form,
            "pageTitle": "Edit Page"
        })
    return render(request, "encyclopedia/edit-entry.html", {
        "form": EntryForm(),
        "pageTitle": "New Page"
    })


def random_page(request):
    rand = Random()
    entries = util.list_entries()
    title = entries[int(rand.random()*len(entries))]
    return redirect("entry", title=title)