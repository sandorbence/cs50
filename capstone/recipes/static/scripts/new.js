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

    addOptions(select);

    // If document is edited
    if (document.getElementById('recipe-data')) {
        fillFieldsWithRecipeData();
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

    // Add metric options to select
    for (unit of metric) {
        let option = document.createElement('option');
        option.textContent = unit;
        select.appendChild(option);
    }
}

function addRow() {
    const form = document.getElementById('new-ingredient-form');
    form.style.display = 'flex';
    form.onsubmit = addIngredient;
    form.onreset = cancel;
}

function addIngredient() {

    let name = document.getElementById('ingredient-name').value;
    let quantity = document.getElementById('ingredient-quantity').value;
    if (name === '' || quantity === '') {
        if (document.getElementById('ingredient-unit').value !== 'to taste') {
            const toastTitle = `Can't be empty`;
            const toastMessage = `Please fill out all of the ingredient's sections.`
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

function cancel() {
    document.getElementById('ingredient-name').value = '';
    document.getElementById('ingredient-quantity').value = '';
    document.getElementById('new-ingredient-form').style.display = 'none';
    return false;
}

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

    let nameTextInput = document.createElement('input');
    nameTextInput.type = 'text';
    rowEdit.append(nameTextInput);

    let quantityNumberInput = document.createElement('input');
    quantityNumberInput.type = 'number';
    quantityNumberInput.step = 0.001;
    rowEdit.append(quantityNumberInput);

    let quantityUnitInput = document.createElement('select');
    addOptions(quantityUnitInput);
    rowEdit.append(quantityUnitInput);

    let unitDiv = document.createElement('div');
    let unitCheckBox = document.createElement('input');
    unitCheckBox.type = 'checkbox';
    unitCheckBox.addEventListener('change', () => changeUnits(quantityUnitInput, unitCheckBox));

    let label = document.createElement('label');
    label.textContent = 'Imperial units';

    unitDiv.append(unitCheckBox);
    unitDiv.append(label);
    rowEdit.append(unitDiv);

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
    btnDel.classList.add('btn', 'btn-primary', 'btn-del');
    btnDel.textContent = 'X';
    btnDel.addEventListener('click', () => deleteRow(row));
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

function deleteRow(row) {
    row.remove();
}

function editRow(row) {

    // If we are already adding an ingredient, do not interrupt with edit
    // as we will use the same form for editing as adding
    if (document.getElementById('new-ingredient-form').style.display !== 'none' &&
        (document.getElementById('ingredient-name').value !== '' ||
            document.getElementById('ingredient-quantity').value !== '')) {
        const toastTitle = 'Cannot add ingredient';
        const toastMessage = 'Please add the started ingredient before editing.';
        showToast(toastTitle, toastMessage);
    }
    else {
        let quantity = row.querySelector('.ingredient-quantity').textContent;

        row.querySelector('.row-show').style.display = 'none';
        row.querySelector('.row-edit').style.display = 'flex';
        row.querySelector('input[type=text]').value = row.querySelector('.ingredient-name').textContent;
        row.querySelector('input[type=number]').value = quantity.split(' ')[0];
        row.querySelector('select').value = quantity.split(' ')[1];

        row.querySelector('.btn-edit').style.display = 'none';
        row.querySelector('.btn-del').style.display = 'none';
        row.querySelector('.btn-done').style.display = 'inline-block';
    }
}

function editDone(row) {
    row.querySelector('.ingredient-name').textContent = row.querySelector('input[type=text]').value;

    let quantity = row.querySelector('input[type=number]').value;
    let unit = row.querySelector('select').value;

    row.querySelector('.ingredient-quantity').textContent = quantity + ' ' + unit;

    row.querySelector('.row-edit').style.display = 'none';
    row.querySelector('.row-show').style.display = 'flex';

    row.querySelector('.btn-done').style.display = 'none';
    row.querySelector('.btn-edit').style.display = 'inline-block';
    row.querySelector('.btn-del').style.display = 'inline-block';
}

function showToast(title, message) {
    let toast = document.getElementById('myToast');
    toast.querySelector('.mr-auto').textContent = title;
    toast.querySelector('.toast-body').textContent = message;
    toast.classList.add('show');

    document.querySelector('.close').addEventListener('click', hideToast);

    setTimeout(hideToast, 3000);
}

function hideToast() {
    document.getElementById('myToast').classList.remove('show');
}

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
        // 6 is added to the characters, because we will identify steps with -step-
        characters += step.value.length + 6;
    });


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

function back() {
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('btn-next').style.display = 'flex';
    document.getElementById('description-container').style.display = 'flex';
}

function save() {

    let recipeData = document.getElementById('recipe-data');

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

    let title = document.getElementById('title').querySelector('input').value;
    let image = document.getElementById('image-upload').files[0];
    let prepTime = document.getElementById('prep-time').value;
    let totalTime = document.getElementById('total-time').value;
    let servings = document.getElementById('servings').value;
    let category = document.getElementById('category').querySelector('select').value;

    let allergens = document.getElementById('image-container').querySelectorAll('input[type=checkbox]');
    let chosenAllergens = Array.from(allergens).filter(allergen => allergen.checked).map(allergen => allergen.value);

    if (!totalTime || !servings) {
        const toastTitle = 'Cannot be empty';
        const toastMessage = 'Please fill out servings and total time.';
        showToast(toastTitle, toastMessage)
        return;
    }

    data.append('title', title);
    data.append('preparation', JSON.stringify(preparation));
    data.append('ingredients', JSON.stringify(ingredients));
    data.append('category', category);
    data.append('totaltime', totalTime);
    data.append('servings', servings);

    if (prepTime) data.append('preptime', prepTime);
    if (image) data.append('image', image);
    if (chosenAllergens.length > 0) data.append('allergens', JSON.stringify(chosenAllergens));

    if (recipeData) {
        let recipeID = JSON.parse(recipeData.value).id;
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

function changeUnits(select, checkBox) {

    let metric = document.getElementById('metric-units').value
        .slice(1, -1)
        .split(', ')
        .map((unit) => {
            return unit.replace(/'/g, '');
        });

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

function addStep() {
    const container = document.getElementById('new-recipe-description');

    let step = document.createElement('div')
    let text = document.createElement('textarea');
    text.classList.add('step');

    text.placeholder = 'Step ' + (document.querySelectorAll('textarea').length + 1) + ':';

    let remove = document.createElement('button');
    remove.textContent = 'x';
    remove.classList.add('btn', 'btn-primary', 'remove');
    remove.addEventListener('click', () => removeStep(step));

    step.append(text);
    step.append(remove);

    step.style.position = 'relative';

    container.insertBefore(step, document.getElementById('btn-addstep'))

    return step;
}

// Remove preparation step
function removeStep(step) {
    step.remove();
    let textareas = document.querySelectorAll('textarea');

    // Update placeholders in text areas
    for (let i = 1; i < textareas.length; i++) {
        textareas[i].placeholder = 'Step ' + (i + 1) + ':';
    }
}

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

function fillFieldsWithRecipeData() {

    const recipeData = JSON.parse(document.getElementById('recipe-data').value);
    let steps = JSON.parse(document.getElementById('steps').value);

    document.getElementById('title').querySelector('input').value = recipeData.title;

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
    recipeData.ingredients.forEach(ingredient => {
        createRow(ingredient.name, ingredient.quantity);
    });

    if (recipeData.image) {
        document.getElementById('image-preview').src = recipeData.image;
    }

    if (recipeData.prep_time) {
        document.getElementById('prep-time').value = recipeData.prep_time;
    }

    document.getElementById('total-time').value = recipeData.total_time;
    document.getElementById('servings').value = recipeData.servings;

    // Set category
    document.getElementById('category').querySelector('select').value = recipeData.category[0].name;

    // Check allergens
    let boxes = document.getElementById('allergens').querySelectorAll('input[type=checkbox]');

    if (recipeData.allergens.length > 0) {
        recipeData.allergens.forEach(allergen => {
            for (let i = 0; i < boxes.length; i++) {
                if (allergen === boxes[i].value) {
                    boxes[i].checked = true;
                }
            }
        })
    }
}

function clearImage(path) {
    document.getElementById('image-upload').value = '';
    document.getElementById('image-preview').src = path;
    document.getElementById('btn-clear').style.display = 'none';
}