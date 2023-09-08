const STAR_EMPTY = document.getElementById('star-empty').value;
const STAR_FILLED = document.getElementById('star-filled').value;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => favorite(button))
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