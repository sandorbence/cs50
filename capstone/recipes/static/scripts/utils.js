const STAR_EMPTY = document.getElementById('star-empty').value;
const STAR_FILLED = document.getElementById('star-filled').value;

function favorite(button) {

    let image = button.querySelector('img');

    let favorite = false;

    // Change graphics for specific recipe
    if (image.alt === 'add') {
        image.src = STAR_FILLED;
        image.alt = 'remove'
        favorite = true;
    }
    else {
        image.alt = 'add'
        image.src = STAR_EMPTY;
    }

    // Favorite/unfavorite recipes
    fetch('/recipes/' + button.id, {
        method: 'PATCH',
        body: JSON.stringify({
            'favorite': favorite
        })
    }).then(response => response.json())
        .then(message => console.log(message));

    return false;
}

// Hide he confirmation prompt
function hideModal() {
    let selectDiv = document.getElementById('options');
    if (selectDiv) {
        let select = selectDiv.querySelector('select');
        select.value = '';
        select.style.visibility = 'visible';
    }
    document.querySelector('.modal').style.display = 'none';
}

// Display confirmation prompt
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