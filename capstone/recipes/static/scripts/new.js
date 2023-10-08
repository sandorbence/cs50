document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('ingredient-unit');
    const checkBox = document.getElementById('unit-change');
    const imagePath = document.getElementById('image-preview').src;

    document.getElementById('new-ingredient-form').style.display = 'none';
    document.getElementById('image-container').style.display = 'none';
    select.addEventListener('change', unitChanged);
    checkBox.addEventListener('change', () => changeUnits(select, checkBox));
    document.getElementById('btn-plus').addEventListener('click', addRow);
    document.getElementById('btn-next').addEventListener('click', next);
    document.getElementById('btn-back').addEventListener('click', back);
    document.getElementById('btn-clear').addEventListener('click', () => clearImage(imagePath));
    document.getElementById('btn-save').addEventListener('click', save);
    document.getElementById('image-upload').addEventListener('change', (event) => showPreview(event.target));
    document.getElementById('btn-addstep').addEventListener('click', addStep);

    let prepTime = document.getElementById('prep-time');
    let totalTime = document.getElementById('total-time');
    let servings = document.getElementById('servings');

    prepTime.addEventListener('keyup', () => checkInput(prepTime, 0, 999));
    totalTime.addEventListener('keyup', () => checkInput(totalTime, 1, 999));
    servings.addEventListener('keyup', () => checkInput(servings, 1, 999));

    addOptions(select);

    // If document is being edited
    if (document.getElementById('recipe-id')) {
        const recipeID = document.getElementById('recipe-id').value;
        fetch('/recipes/' + recipeID)
            .then(response => response.json())
            .then(recipe => {
                fillFieldsWithRecipeData(recipe);
            })
    }

    document.getElementById('btn-clear').style.display = 'none';
});

function addOptions(select) {
    let units = document.getElementById('units').value
        .slice(1, -1)
        .split(', ')
        .map((unit) => {
            return unit.replace(/'/g, '');
        });

    // Add basic options to select
    for (unit of units) {
        let option = document.createElement('option');
        option.textContent = unit;
        select.appendChild(option);
    }

    let metric = document.getElementById('metric-units').value
        .slice(1, -1)
        .split(', ')
        .map((unit) => {
            return unit.replace(/'/g, '');
        });

    // Add metric options to select as default
    for (unit of metric) {
        let option = document.createElement('option');
        option.textContent = unit;
        select.appendChild(option);
    }
}

// Show the new ingredient form
function addRow() {
    document.getElementById('btn-plus').parentElement.style.display = 'none';
    const form = document.getElementById('new-ingredient-form');
    form.style.display = 'flex';
    form.onsubmit = addIngredient;
    form.onreset = cancel;
}

// Add an ingredient with the user's input data
// Callback function for  for the 'Add' button
function addIngredient() {
    let name = document.getElementById('ingredient-name').value;
    let quantity = document.getElementById('ingredient-quantity').value;

    if (name === '' || quantity === '') {
        const toastTitle = 'Cannot be empty';
        const toastMessage = `Please fill out all of the ingredient's sections.`;

        if (document.getElementById('ingredient-unit').value !== 'to taste') {
            showToast(toastTitle, toastMessage);
            return false;
        }
        else if (name === '') {
            showToast(toastTitle, toastMessage);
            return false;
        }
    }

    let unit = document.getElementById('ingredient-unit').value;
    quantity = quantity + ' ' + unit;

    createRow(name, quantity);

    document.getElementById('ingredient-name').value = '';
    document.getElementById('ingredient-quantity').value = '';

    return false;
}

// Hide the new ingredient form
function cancel() {
    document.getElementById('ingredient-name').value = '';
    document.getElementById('ingredient-quantity').value = '';
    document.getElementById('new-ingredient-form').style.display = 'none';
    document.getElementById('btn-plus').parentElement.style.display = 'flex';
    return false;
}

// Create an ingredient row
// Create both visible items and hidden ones
// which are only visible when editing
function createRow(name, quantity) {
    const container = document.getElementById('ingredients-container');

    let row = document.createElement('div');
    row.classList.add('ingredient');

    let rowEdit = document.createElement('div');
    rowEdit.classList.add('row-edit');

    let rowShow = document.createElement('div');
    rowShow.classList.add('row-show');

    let ingName = document.createElement('div');
    ingName.textContent = name;
    ingName.classList.add('ingredient-name');
    rowShow.append(ingName);

    let ingQuantity = document.createElement('div');
    ingQuantity.textContent = quantity;
    ingQuantity.classList.add('ingredient-quantity');
    rowShow.append(ingQuantity);

    let labelName = document.createElement('label');
    labelName.textContent = 'Name:';

    let nameTextInput = document.createElement('input');
    nameTextInput.type = 'text';
    nameTextInput.maxLength = 100;
    labelName.append(nameTextInput);
    rowEdit.append(labelName);

    let labelQuantity = document.createElement('label');
    labelQuantity.textContent = 'Quantity:';

    let divQuantity = document.createElement('div');
    let quantityNumberInput = document.createElement('input');
    quantityNumberInput.type = 'number';
    quantityNumberInput.step = 0.001;
    labelQuantity.append(quantityNumberInput);
    divQuantity.append(labelQuantity);

    let quantityUnitInput = document.createElement('select');
    addOptions(quantityUnitInput);
    divQuantity.append(quantityUnitInput);
    rowEdit.append(divQuantity);

    let unitCheckBox = document.createElement('input');
    unitCheckBox.type = 'checkbox';
    unitCheckBox.addEventListener('change', () => changeUnits(quantityUnitInput, unitCheckBox));

    let labelUnit = document.createElement('label');
    labelUnit.append(unitCheckBox);
    let checkBoxText = document.createTextNode('Imperial units');
    labelUnit.appendChild(checkBoxText);
    rowEdit.append(labelUnit);

    rowEdit.style.display = 'none';
    row.append(rowEdit);
    row.append(rowShow);

    let btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    let btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'btn-primary', 'btn-edit');
    btnEdit.textContent = 'Edit';
    btnEdit.addEventListener('click', () => editRow(row, name, quantity));
    btnContainer.append(btnEdit);

    let btnDel = document.createElement('button');
    btnDel.classList.add('btn', 'btn-secondary', 'btn-del');
    btnDel.textContent = 'Delete';
    btnDel.addEventListener('click', () => deleteRow(row));
    btnDel.style.display = 'none';
    btnContainer.append(btnDel);

    let btnDone = document.createElement('button');
    btnDone.classList.add('btn', 'btn-primary', 'btn-done');
    btnDone.textContent = 'Done';
    btnDone.addEventListener('click', () => editDone(row));
    btnDone.style.display = 'none';
    btnContainer.append(btnDone);

    row.append(btnContainer);

    container.append(row);
}

// Callback function for 'X' button
function deleteRow(row) {
    row.remove();
}

// Callback function for 'Edit' button
function editRow(row) {
    let quantity = row.querySelector('.ingredient-quantity').textContent.split(' ');
    let select = row.querySelector('select');
    let rowEdit = row.querySelector('.row-edit');

    row.style.flexDirection = 'column';
    row.querySelector('.btn-container').style.width = '100%';

    row.querySelector('.row-show').style.display = 'none';
    rowEdit.style.display = 'flex';
    row.querySelector('input[type=text]').value = row.querySelector('.ingredient-name').textContent;

    row.querySelector('input[type=number]').value = quantity[0];

    // If unit was imperial, change set of units
    if (!Array.from(select.options).some(option => option.value === quantity[1])) {
        let checkbox = rowEdit.querySelector('input[type=checkbox]');
        checkbox.checked = true;
        changeUnits(select, checkbox);
    }
    select.value = quantity[1];

    row.querySelector('.btn-edit').style.display = 'none';
    row.querySelector('.btn-del').style.display = 'inline-block';
    row.querySelector('.btn-done').style.display = 'inline-block';

}

// Callback function for 'Done' button
function editDone(row) {
    row.querySelector('.ingredient-name').textContent = row.querySelector('input[type=text]').value;

    let quantity = row.querySelector('input[type=number]').value;
    let unit = row.querySelector('select').value;

    row.style.flexDirection = 'row';
    row.querySelector('.btn-container').style.width = 'initial';

    row.querySelector('.ingredient-quantity').textContent = quantity + ' ' + unit;

    row.querySelector('.row-edit').style.display = 'none';
    row.querySelector('.row-show').style.display = 'flex';

    row.querySelector('.btn-done').style.display = 'none';
    row.querySelector('.btn-del').style.display = 'none';
    row.querySelector('.btn-edit').style.display = 'inline-block';
}

// Step to next page
function next() {

    let shouldContinue = true;

    let maxCharacters = document.getElementById('max-characters').value;
    let characters = 0;

    if (document.getElementById('title').querySelector('input').value === '' ||
        document.querySelector('textarea').value === '' ||
        document.querySelectorAll('.ingredient').length < 3) {
        const toastTitle = 'Cannot be empty';
        const toastMessage = 'The recipe must have a title, a preparation and at least one ingredient.';
        showToast(toastTitle, toastMessage);
        return;
    }

    document.querySelectorAll('textarea').forEach(step => {
        if (step.value === '') {
            const toastTitle = 'Cannot be empty';
            const toastMessage = 'There should be no empty steps.';
            showToast(toastTitle, toastMessage);
            shouldContinue = false;
        }
        // 6 is added to the characters, because we will identify steps with '-step-'
        characters += step.value.length + 6;
    });

    // Check for maximum characters in preparation
    if (characters > maxCharacters) {
        const toastTitle = 'Preparation too long';
        const toastMessage = `The maximum characters for the preparation is ${maxCharacters}. You have written ${characters} characters.`;
        showToast(toastTitle, toastMessage)
        return;
    }

    if (!shouldContinue) return;

    document.getElementById('description-container').style.display = 'none';
    document.getElementById('btn-next').style.display = 'none';
    document.getElementById('image-container').style.display = 'flex';
}

// Step back to previous page
function back() {
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('btn-next').style.display = 'flex';
    document.getElementById('description-container').style.display = 'block';
}

// Send recipe data to API endpoint
function save() {
    let recipeID = null;
    if (document.getElementById('recipe-id')) {
        recipeID = document.getElementById('recipe-id').value;
    }

    // FormData can contain image files
    let data = new FormData();

    let ingredients = Array.from(document.querySelectorAll('.ingredient')).slice(2).map(ingredient => {
        return {
            "name": ingredient.querySelector('.ingredient-name').textContent,
            "quantity": ingredient.querySelector('.ingredient-quantity').textContent
        }
    });

    let preparation = '';

    Array.from(document.querySelectorAll('textarea')).forEach(step => {
        preparation += `-step-${step.value}`;
    });

    let prepTime = document.getElementById('prep-time').value;
    let totalTime = document.getElementById('total-time').value;
    let servings = document.getElementById('servings').value;

    let title = document.getElementById('title').querySelector('input').value;
    let image = document.getElementById('image-upload').files[0];
    let category = document.getElementById('category').querySelector('select').value;

    let allergens = document.getElementById('image-container').querySelectorAll('input[type=checkbox]');
    let chosenAllergens = Array.from(allergens).filter(allergen => allergen.checked).map(allergen => allergen.value);

    // Show message to user if required fields are empty
    if (!totalTime || !servings) {
        const toastTitle = 'Cannot be empty';
        const toastMessage = 'Please fill out servings and total time.';
        showToast(toastTitle, toastMessage);
        return;
    }

    data.append('title', title);
    data.append('preparation', JSON.stringify(preparation));
    data.append('ingredients', JSON.stringify(ingredients));
    data.append('category', category);
    data.append('totaltime', totalTime);
    data.append('servings', servings);

    // Check if preparation time is less or equal
    // to total time if it's given
    if (prepTime) {
        if (parseInt(prepTime) > parseInt(totalTime)) {
            const toastTitle = 'Invalid time';
            const toastMessage = 'Preparation time cannot be more than total time.';
            showToast(toastTitle, toastMessage);
            return;
        }
        data.append('preptime', prepTime);
    }

    if (image) data.append('image', image);
    if (chosenAllergens.length > 0) data.append('allergens', JSON.stringify(chosenAllergens));

    // If it's an edit post with the corresponding ID
    if (recipeID) {
        fetch('/recipes/' + recipeID, {
            method: 'POST',
            body: data
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
            else {
                return response.json();
            }
        });
    }
    // If a new recipe was created, post with a fake ID
    else {
        fetch('/recipes/0', {
            method: 'POST',
            body: data
        }).then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
            else {
                return response.json();
            }
        });
    }
}

// Display a preview of the selected image
function showPreview(input) {
    if (input.files && input.files[0]) {
        document.getElementById('btn-clear').style.display = 'inline-block';

        const reader = new FileReader();

        reader.onload = (event) => {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = event.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// Callback for ticking the unit changing checkbox
function changeUnits(select, checkBox) {

    // Metric unit choices
    let metric = document.getElementById('metric-units').value
        .slice(1, -1)
        .split(', ')
        .map((unit) => {
            return unit.replace(/'/g, '');
        });

    // Imperial unit choices
    let imperial = document.getElementById('imperial-units').value
        .slice(1, -1)
        .split(', ')
        .map((unit) => {
            return unit.replace(/'/g, '');
        });

    if (checkBox.checked) {

        // Remove metric options
        for (let i = 0; i < metric.length; i++) {
            select.remove(select.length - 1);
        }

        // Add imperial options
        for (unit of imperial) {
            let option = document.createElement('option');
            option.textContent = unit;
            select.appendChild(option);
        }
    }
    else {

        // Remove imperial options
        for (let i = 0; i < imperial.length; i++) {
            select.remove(select.length - 1);
        }

        // Add metric options
        for (unit of metric) {
            let option = document.createElement('option');
            option.textContent = unit;
            select.appendChild(option);
        }
    }

    return false;
}

// Add a new step for preparation
function addStep() {
    const container = document.getElementById('new-recipe-description');

    let step = document.createElement('div')
    let text = document.createElement('textarea');
    text.classList.add('step');

    text.placeholder = 'Step ' + (document.querySelectorAll('textarea').length + 1) + ':';

    let remove = document.createElement('button');
    remove.textContent = 'x';
    remove.classList.add('btn', 'btn-secondary', 'remove');
    remove.addEventListener('click', () => removeStep(step));

    step.append(text);
    step.append(remove);

    step.style.position = 'relative';

    container.append(step);

    // Scroll the div to the bottom, 
    // so that newly added step is fully visible
    container.scrollTop = container.scrollHeight;

    return step;
}

// Remove preparation step
function removeStep(step) {
    step.remove();
    let textareaAll = document.querySelectorAll('textarea');

    // Update placeholders in text areas
    for (let i = 1; i < textareaAll.length; i++) {
        textareaAll[i].placeholder = 'Step ' + (i + 1) + ':';
    }
}

// Disable quantity for unit 'to taste' as it makes
// no sense to quantify it
function unitChanged() {
    const select = document.getElementById('ingredient-unit');
    let input = document.getElementById('ingredient-quantity');

    if (select.value === 'to taste') {
        input.value = '';
        input.disabled = true;
    }
    else {
        input.disabled = false;
    }
}

// Populate input fields with existing data of recipe being edited
function fillFieldsWithRecipeData(recipe) {
    let steps = recipe.preparation.split('-step-');
    steps.shift();

    document.getElementById('title').querySelector('input').value = recipe.title;

    // Add a new step for each one in the existing recipe
    document.getElementById('new-recipe-description').querySelector('textarea').value = steps[0];
    if (steps.length > 1) {
        steps = steps.slice(1)

        steps.forEach(step => {
            let element = addStep();
            element.querySelector('textarea').value = step;
        });
    }

    // Add all ingredients in recipe
    recipe.ingredients.forEach(ingredient => {
        createRow(ingredient.name, ingredient.quantity);
    });

    if (recipe.image) {
        document.getElementById('image-preview').src = recipe.image;
    }

    if (recipe.prep_time) {
        document.getElementById('prep-time').value = recipe.prep_time;
    }

    document.getElementById('total-time').value = recipe.total_time;
    document.getElementById('servings').value = recipe.servings;

    // Set category
    document.getElementById('category').querySelector('select').value = recipe.category;

    // Check allergens
    let boxes = document.getElementById('allergens').querySelectorAll('input[type=checkbox]');

    // Check all previously added allergens' boxes
    if (recipe.allergens.length > 0) {
        recipe.allergens.forEach(allergen => {
            for (let i = 0; i < boxes.length; i++) {
                if (allergen === boxes[i].value) {
                    boxes[i].checked = true;
                }
            }
        })
    }
}

// Remove preview image and content of file input
function clearImage(path) {
    document.getElementById('image-upload').value = '';
    document.getElementById('image-preview').src = path;
    document.getElementById('btn-clear').style.display = 'none';
}

// Check if user input matches criteria
function checkInput(element, min, max) {
    if (isNaN(parseInt(element.value))) {
        element.value = min;
        return;
    }
    if (parseInt(element.value) < min) {
        element.value = min;
        return;
    }
    if (parseInt(element.value) > max) {
        element.value = max;
    }
}

// Show custom messages to the user
function showToast(title, message) {
    let toast = document.getElementById('toast');
    toast.querySelector('.mr-auto').textContent = title;
    toast.querySelector('.toast-body').textContent = message;
    toast.classList.add('show');

    document.querySelector('.close').addEventListener('click', hideToast);

    setTimeout(hideToast, 3000);
}

// Hide the toast
function hideToast() {
    document.getElementById('toast').classList.remove('show');
}
