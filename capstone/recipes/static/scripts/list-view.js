document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.star').forEach(button => {
        button.addEventListener('click', () => favorite(button))
    });
    document.getElementById('btn-sidebar').addEventListener('click', toggleSideBar);

    const searchContainer = document.getElementById('search-container');
    const searchBar = searchContainer.querySelector('input[type=text]');
    const select = searchContainer.querySelector('select');

    searchContainer.querySelector('label[for="id_category"]').style.display = 'none';

    // Needed if page is refreshed
    searchBar.value = '';

    // Add option to category filter to include all categories as default
    let optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.innerText = 'All categories';
    select.prepend(optionAll);
    select.selectedIndex = 0;

    // Add event listeners for searching recipes
    searchBar.addEventListener('keyup', filterRecipes);
    select.addEventListener('change', filterRecipes);
    searchContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        // Needed if page is refreshed
        checkbox.checked = false;
        checkbox.addEventListener('change', filterRecipes);
    });

    setElementsMaxWidth();

    window.addEventListener('resize', setElementsMaxWidth);
});

// Open/close sidebar for searching
function toggleSideBar() {
    const sidebar = document.getElementById('sidebar');
    const searchContainer = document.getElementById('search-container');

    sidebar.classList.toggle('sidebar-open');
    searchContainer.classList.toggle('no-display');
}

// Callback for changing any of the filtering inputs
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

    // API call for filtering recipes
    fetch('/filter/?' + query)
        .then(response => response.json())
        .then(response => {
            let ids = response.message.split(',').slice(0, -1);
            displayFilteredRecipes(ids);
        });
}

// Display all recipes that match filters,
// hide ones that don't
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

// Resize elements dynamically, otherwise ones with longer title overflow
function setElementsMaxWidth() {
    let windowWidth = window.innerWidth;
    let containerWidth = document.getElementById('list-view-list-container').offsetWidth;
    let card = document.querySelector('.list-view-element');
    let margin = parseInt(window.getComputedStyle(card).margin.slice(0, -2));

    if (windowWidth > 600) {
        let maxWidth = `${Math.round(containerWidth / 4 - 2 * margin)}px`;

        document.querySelectorAll('.list-view-element').forEach(element => {
            element.style.maxWidth = maxWidth;
        })
    }
    else {
        document.querySelectorAll('.list-view-element').forEach(element => {
            element.style.maxWidth = `${containerWidth}px`;
        })
    }
}