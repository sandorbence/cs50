const STAR_EMPTY = document.getElementById('star-empty').value;
const STAR_FILLED = document.getElementById('star-filled').value;

document.addEventListener('DOMContentLoaded', () => {

    let originalServings = document.getElementById('servings').value;

    let originalQuantities = Array.from(document.querySelectorAll('.recipe-quantity')).map(quantity => {
        return quantity.textContent.split(' ');
    });

    document.querySelectorAll('.star').forEach(button => {
        button.addEventListener('click', () => favorite(button))
    });

    let servings = document.getElementById('servings');
    servings.addEventListener('change', () => changePortions(originalServings, originalQuantities));
    servings.addEventListener('keyup', () => checkInput(originalServings, originalQuantities));

    let selectDiv = document.getElementById('options');
    if (selectDiv) {
        selectDiv.querySelector('select').addEventListener('change', selectOption);
    }

    hideModal();
});

function changePortions(originalServings, originalQuantities) {
    let servings = document.getElementById('servings').value;

    let newQuantities = originalQuantities.map(quantity => {
        // If the quantity is 'to taste'
        if (isNaN(quantity[0])) return quantity[0] + ' ' + quantity[1];

        // Else return the rounded new quantity
        return Math.round(quantity[0] * servings / originalServings * 100) / 100 + ' ' + quantity[1];
    })

    // Set the new quantities
    for (let i = 0; i < newQuantities.length; i++) {
        document.querySelectorAll('.recipe-quantity')[i].textContent = newQuantities[i];
    }
}

function checkInput(originalServings, originalQuantities) {
    if (document.getElementById('servings').value < 1) {
        document.getElementById('servings').value = 1;
        changePortions(originalServings, originalQuantities);
    }
    if (document.getElementById('servings').value > 999) {
        document.getElementById('servings').value = 999;
        changePortions(originalServings, originalQuantities);
    }
}

function selectOption() {
    let editForm = document.getElementById('edit');
    const modalTitle = 'Delete recipe?';
    const modalMessage = 'Are you sure you want to delete this recipe?';
    const closeText = 'Cancel';
    const proceedText = 'Delete';

    let select = document.getElementById('options').querySelector('select');
    let method = select.value;

    // So that image and selected option do not overlap
    select.style.visibility = 'hidden';

    if (method == 'edit') {
        editForm.submit();
    }
    else {
        showModal(modalTitle, modalMessage, closeText, proceedText, hideModal, deleteRecipe);
    }
}

function deleteRecipe() {
    let deleteForm = document.getElementById('delete');
    deleteForm.submit();
}

function hideModal() {
    let selectDiv = document.getElementById('options');
    if (selectDiv) {
        let select = selectDiv.querySelector('select');
        select.value = '';
        select.style.visibility = 'visible';
    }
    document.querySelector('.modal').style.display = 'none';
}

function showModal(title, message, closeText, proceedText, onClose, onProceed) {
    let modal = document.querySelector('.modal');
    let btnClose = document.getElementById('close');
    let btnProceed = document.getElementById('proceed');

    btnClose.textContent = closeText;
    btnClose.addEventListener('click', onClose);

    btnProceed.textContent = proceedText;
    btnProceed.addEventListener('click', onProceed);

    modal.querySelector('.close').addEventListener('click', onClose);

    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-body').textContent = message;
    modal.style.display = 'block';
}

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