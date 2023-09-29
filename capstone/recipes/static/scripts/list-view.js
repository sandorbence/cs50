const STAR_EMPTY = document.getElementById('star-empty').value;
const STAR_FILLED = document.getElementById('star-filled').value;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.star').forEach(button => {
        button.addEventListener('click', () => favorite(button))
    });
    document.getElementById('btn-sidebar').addEventListener('click', toggleSideBar);

    const searchContainer = document.getElementById('search-container');
    const searchBar = searchContainer.querySelector('input[type=text]');
    const select = searchContainer.querySelector('select');

    searchContainer.querySelector('label[for="id_category"]').style.display = 'none';

    searchBar.value = '';

    let optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.innerText = 'All categories';
    select.prepend(optionAll);
    select.selectedIndex = 0;

    searchBar.addEventListener('keyup', filterRecipes);
    select.addEventListener('change', filterRecipes);
    searchContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.addEventListener('change', filterRecipes);
    });
});

function favorite(button) {

    let image = button.querySelector('img');

    let favorite = false;

    if (image.alt === 'add') {
        image.src = STAR_FILLED;
        image.alt = 'remove'
        favorite = true;
    }
    else {
        image.alt = 'add'
        image.src = STAR_EMPTY;
    }

    fetch('/recipes/' + button.id, {
        method: 'PUT',
        body: JSON.stringify({
            'favorite': favorite
        })
    }).then(response => response.json())
        .then(message => console.log(message));

    return false;
}

function toggleSideBar() {
    const sidebar = document.getElementById('sidebar');
    const searchContainer = document.getElementById('search-container');

    sidebar.classList.toggle('sidebar-open');
    searchContainer.classList.toggle('no-display');
}

function filterRecipes() {
    const searchContainer = document.getElementById('search-container');

    let searchBarText = searchContainer.querySelector('input[type=text]').value;
    let category = searchContainer.querySelector('select').value;
    let checkBoxes = searchContainer.querySelectorAll('input[type=checkbox]');
    let allergens = Array.from(checkBoxes).filter(checkbox => checkbox.checked).map(allergen => allergen.value);

    let allergensString = '';

    for (let i = 0; i < allergens.length; i++) {
        allergensString += allergens[i] + ',';
    }

    let query = `searchbar=${searchBarText}&category=${category}&allergens=${allergensString}`;

    fetch('/filter/?' + query)
        .then(response => response.json())
        .then(response => {
            let ids = response.message.split(',').slice(0, -1);
            displayFilteredRecipes(ids);
        });
}

function displayFilteredRecipes(ids) {
    let recipes = document.querySelectorAll('.recipe-card');
    recipes.forEach(recipe => {
        if (ids.includes(recipe.id)) {
            recipe.style.display = 'flex';
        }
        else {
            recipe.style.display = 'none';
        }
    })
}