# RecipesCapstone Project

## About the Application

The recipes project is a recipe sharing web application. Users can
* Access all uploaded recipes that contain ingredients, listed allergens and the preparation of the meal
* Search the database by typing in the search bar, choosing a category or picking allergens they do not want the meal to contain
* When viewing a recipe, scale the ingredients quantities by changing the number of servings

Signed in users can
* Create new recipes and edit/delete their own ones
* Add recipes to their favorites, making it faster to look for previously liked meals
* Look at their own recipes on a separate page, so that they can find the recipes they want to edit or delete

## Running the Application

1. Clone the repository
2. Install packages listed in the requirements.txt
3. Run the addallergens command by running "python manage.py addallergens" to populate database with all allergen model instances (only if you start with an empty database)
4. Run "python manage.py runserver" to start the application

## Content of Each File Created

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
* layout.html: The base html file that contains the main layout and is extended by the other html files
* list-view.html: The page that displays recipes, it is shared by 3 views
* login.html: Login page
* new.html: Page used for creating and editing a recipe
* recipe.html: Page displaying a specific recipe
* register.html: Register page

### management/commands folder

* addallergens.py: Command that is used for populating an empty database with all of the allergen model instances

## Distinctiveness and Complexity

The recipes capstone project utilizes everything learnt throughout the course. Compared to previous projects I added a more complex searching for the recipe model instances, for which I used the API that I created. As there are way more model fields for the recipe model than any of the previous ones, it makes it harder to keep validation error-free. Besides server side validation I used JavaScript for client side validation for most of the input fields when creating a new model instance. Making the website mobile responsive was a requirement, however that also added to the complexity, as I had to restyle all of the html code as well as add extra behaviour based on screen width to my JavaScript code. It is possible to edit all of the recipe model instances created by the same user. I made it possible for the user to edit the image for a recipe, which required the usage of FormData, not just simple JSON data. My web pages contain more complex JS code compared to any of the previous projects, which makes the application responsive and user friendly. When creating a new recipe I used DOM manipulation just like in the mail project, but on a higher level. For filtering the recipes that appear after a search query was sent I also used JS, so that the user immediatly sees the result of the query (just like in the wiki project, but extended).

## Ideas to Improve

* List nutrients for each recipe so that users can pick meals for their diet
* Add fractional numbers to the ingredient adding form, 1/3 looks better than 0.33
* Add an option for the user to attach images to each of the steps of the preparation description

## Credit

For the recipes displayed on my site I used the images and descriptions from [Simply Recipes](https://www.simplyrecipes.com/). The 404 error image is from [StorySet](https://storyset.com/web).