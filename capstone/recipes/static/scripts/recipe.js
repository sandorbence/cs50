document.addEventListener('DOMContentLoaded', () => {

    let originalServings = document.getElementById('servings').value;

    let originalQuantities = Array.from(document.querySelectorAll('.recipe-quantity')).map(quantity => {
        return quantity.textContent.split(' ');
    });

    let servings = document.getElementById('servings');
    servings.addEventListener('change', () => changePortions(originalServings, originalQuantities));
    servings.addEventListener('keyup', () => checkInput(originalServings, originalQuantities));
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