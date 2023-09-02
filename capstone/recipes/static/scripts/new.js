document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('new-ingredient-form').style.display = 'none';
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('plus-button').addEventListener('click', addRow)
    document.getElementById('next').querySelector('button').addEventListener('click', next);
    document.getElementById('back').querySelector('button').addEventListener('click', back);
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
    if (name === '' || quantity === '') return false;

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
    row.append(ingName);

    let ingQuantity = document.createElement('div');
    ingQuantity.textContent = quantity;
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
        showToast();
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

function showToast() {
    let toast = document.getElementById('myToast');
    toast.classList.add('show');

    document.querySelector('.close').addEventListener('click', hideToast);

    setTimeout(hideToast, 3000);
}

function hideToast() {
    document.getElementById('myToast').classList.remove('show');
}

function next() {
    document.getElementById('description-container').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('image-container').style.display = 'flex';
}

function back() {
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('next').style.display = 'flex';
    document.getElementById('description-container').style.display = 'flex';
}