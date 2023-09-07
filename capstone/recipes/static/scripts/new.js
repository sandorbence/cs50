document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('new-ingredient-form').style.display = 'none';
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('ingredient-unit').addEventListener('change', unitChanged)
    document.getElementById('unit-change').addEventListener('change', changeUnits)
    document.getElementById('btn-plus').addEventListener('click', addRow)
    document.getElementById('btn-next').addEventListener('click', next);
    document.getElementById('btn-back').addEventListener('click', back);
    document.getElementById('btn-save').addEventListener('click', save);
    document.getElementById('image-upload').addEventListener('change', (event) => showPreview(event.target));
    document.getElementById('btn-addstep').addEventListener('click', addStep)

    const select = document.getElementById('ingredient-unit');

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
})

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

    let ingName = document.createElement('div');
    ingName.textContent = name;
    ingName.classList.add('ingredient-name');
    row.append(ingName);

    let ingQuantity = document.createElement('div');
    ingQuantity.textContent = quantity;
    ingQuantity.classList.add('ingredient-quantity');
    row.append(ingQuantity);

    let btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');

    let btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'btn-primary');
    btnEdit.textContent = 'Edit';
    btnEdit.addEventListener('click', () => editRow(row, name, quantity));
    btnContainer.append(btnEdit);

    let btnDel = document.createElement('button');
    btnDel.classList.add('btn', 'btn-primary');
    btnDel.textContent = 'X';
    btnDel.addEventListener('click', () => deleteRow(row));
    btnContainer.append(btnDel);

    row.append(btnContainer);

    container.append(row);
}

function deleteRow(row) {
    row.remove();
}

function editRow(row, name, quantity) {

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
        document.getElementById('new-ingredient-form').style.display = 'flex';
        document.getElementById('ingredient-name').value = name;

        let split = quantity.split(' ')
        document.getElementById('ingredient-quantity').value = split[0];
        document.getElementById('ingredient-unit').value = split[1];

        row.remove();
    }
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

    data.append('title', title);
    data.append('preparation', JSON.stringify(preparation));
    data.append('ingredients', JSON.stringify(ingredients));

    if (prepTime) data.append('preptime', prepTime);
    if (totalTime) data.append('totaltime', totalTime);
    if (servings) data.append('servings', servings);
    if (image) data.append('image', image);

    fetch('/new', {
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

function showPreview(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (event) => {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = event.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function changeUnits() {
    const select = document.getElementById('ingredient-unit');

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

    if (document.getElementById('unit-change').checked) {

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