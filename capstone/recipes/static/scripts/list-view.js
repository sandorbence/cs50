const STAR_EMPTY = document.getElementById('star-empty').value;
const STAR_FILLED = document.getElementById('star-filled').value;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.star').forEach(button => {
        button.addEventListener('click', () => favorite(button))
    });
    document.getElementById('btn-sidebar').addEventListener('click', toggleSideBar);

    const searchContainer = document.getElementById('search-container');

    searchContainer.querySelector('input[type=text]').addEventListener('keyup', filterRecipes);
    searchContainer.querySelector('select').addEventListener('change', filterRecipes);
    searchContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
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
    let checkBoxes = searchContainer.querySelector('input[type=checkbox]');
    let allergens = Array.from(checkBoxes).filter(checkbox => checkbox.checked).map(allergen => allergen.value);

    let recipes = document.querySelectorAll('.recipe-card');

    let query = `searchbar=${searchBarText}&category=${category}`;

    fetch('/filter/?' + query)
        .then(response => response.json())
        .then(asd => console.log(asd))
}