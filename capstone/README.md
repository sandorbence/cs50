# Recipes capstone project

## Running the application

1. Clone the repository
2. Install packages listed in the requirements.txt
3. Run the addallergens command by running "python manage.py addallergens" to populate database with all allergen model instances (only if you start with an empty database)
4. Run "python manage.py runserver" to start the application

## Content of each file I created

* choices.py: A file containing python lists that define choices for model fields and model instances
* requirements.txt: File containing all the required packages used by the application

### static folder

* images folder: All the images needed for the different pages
* recipes/styles.css: The css styling applied on all pages
* scripts folder: The scripts used on all pages
    + list-view.js: Functions for the list-view html page that is embedded in all of the pages that display recipes
    + new.js: Functions that are used when creating or editing a recipe
    + recipe.js: Functionality for the site that displays a specific recipe
    + utils.js: Common functions, that are used by multiple scripts, this file was created to eliminate code duplication

### templates/recipes folder

* 404.html: Page that is displayed when a user wants to access a non-existing recipe id
* favorite.html: Page that displays the recipes that were "favorited" by the user
* index.html: The home page of the application
* layout.html: The base html file that contains the main layout and is extended by the other html files
* list-view.html: The page that displays recipes, other pages include it
* login.html: Login page
* my-recipes.html: Page that displays the recipes created by the user
* new.html: Page used for creating and editing a recipe
* recipe.html: Page displaying a specific recipe
* register.html: Register page

### management/commands folder

* addallergens.py: Command that is used for populating an empty database with all of the allergen model instances

## Distinctiveness and Complexity

The recipes capstone project utilizes everything learnt throughout the course. Compared to previous projects I added a more complex searching for the recipe model instances, for which I used the API that I created. As there are way more model fields for the recipe model than any of the previous ones, it makes it harder to keep validation error-free. Besides server side validation I used JavaScript for client side validation for most of the input fields when creating a new model instance. Making the website mobile responsive was a requirement, however that also added to the complexity, as I had to restyle all of the html code as well as add extra behaviour based on screen width to my JavaScript code. It is possible to edit all of the recipe model instances created by the same user. I made it possible for the user to edit the image for a recipe, which required the usage of FormData, not just simple JSON data. My web pages contain more complex JS code compared to any of the previous projects, which makes the application responsive and user friendly. When creating a new recipe I used DOM manipulation just like in the mail project, but on a higher level. For filtering the recipes that appear after a search query was sent I also used JS, so that the user immediatly sees the result of the query (just like in the wiki project, but extended).

## Credit

For the recipes displayed on my site I used the images and descriptions from [Simply Recipes](https://www.simplyrecipes.com/). The 404 error image is from [StorySet](https://storyset.com/web).