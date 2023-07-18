from django.shortcuts import render, redirect
from django import forms

from . import util

from markdown2 import Markdown

from random import Random

# Form for creating and editing entry contents
class EntryForm(forms.Form):
    title = forms.CharField(label="Title of wiki page",  widget=forms.TextInput(attrs={"placeholder": "Title of entry"}))
    text = forms.CharField(label="", widget=forms.Textarea(
        attrs={"placeholder": "Begin typing your wiki entry"}))
    method = forms.CharField(widget=forms.HiddenInput(), required=False)

# View for main route
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
            # If the function was called via editing,
            # we can overwrite the existing entry
            if form.cleaned_data["method"] == "edit":
                # Without encode() saving adds extra blank lines 
                util.save_entry(title, text.encode())
                return redirect("entry", title=title)
            elif title.lower() not in (entry.lower() for entry in util.list_entries()):
                util.save_entry(title, text.encode())
                return redirect("entry", title=title)
            else:
                raise Exception("Wiki page with that title already exists.")

# View for rendering an entry
def entry(request, title):
    markdown_converter = Markdown()
    try:
        entry_converted = markdown_converter.convert(util.get_entry(title))
    except:
        # Page not found exception page
        return render(request, "encyclopedia/404.html", {
            "title": title.capitalize()
        })
    return render(request, "encyclopedia/entry.html", {
        "title": title.capitalize(),
        "entry": entry_converted
    })

# View for handling search queries
def search(request):
    if request.method == "POST":
        query = request.POST.get("q")
        entries = util.list_entries()
        matches = []
        for entry in entries:
            # Go to entry page if there is a full match
            if query.lower() == entry.lower():
                return redirect("entry", title=query)
            # Add to the list of potential matches
            if query.lower() in entry.lower():
                matches.append(entry)
        return render(request, "encyclopedia/search.html", {
            "query": query,
            "matches": matches
        })
    
# View for handling content editing/adding
def edit_entry(request):
    # If the function was called from an entry page,
    # prefill with the already existing data
    if request.method == "POST":
        form = EntryForm({"title": request.POST.get("title"), "text": util.get_entry(request.POST.get("title")), "method": "edit"})
        return render(request, "encyclopedia/edit-entry.html", {
            "form": form,
            "pageTitle": "Edit Page"
        })
    # If the function was called from the new page button,
    # start with a blank form
    return render(request, "encyclopedia/edit-entry.html", {
        "form": EntryForm(),
        "pageTitle": "New Page"
    })

# View for handling the random button
def random_page(request):
    rand = Random()
    entries = util.list_entries()
    title = entries[int(rand.random()*len(entries))]
    return redirect("entry", title=title)