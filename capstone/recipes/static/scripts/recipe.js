document.addEventListener('DOMContentLoaded', () => {

    let originalServings = document.getElementById('servings').value;

    let originalQuantities = Array.from(document.querySelectorAll('.recipe-quantity>div')).map(quantity => {
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

// Scale all ingredients' quantity according to desired servings
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
        document.querySelectorAll('.recipe-quantity>div')[i].textContent = newQuantities[i];
    }
}


// Do not let the user enter negative or unreasonably big numbers
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

// Handle for options select
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

    // Post to editing endpoint
    if (method == 'edit') {
        editForm.submit();
    }
    // Show prompt to confirm deleting
    else {
        showModal(modalTitle, modalMessage, closeText, proceedText, hideModal, deleteRecipe);
    }
}

// Delete recipe from database
function deleteRecipe() {
    let deleteForm = document.getElementById('delete');
    deleteForm.submit();
}
