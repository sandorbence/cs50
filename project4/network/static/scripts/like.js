document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.btn-like');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => likePost(button));
    })
})

function likePost(button) {

    // Find parent element
    const parent = button.parentElement;

    fetch('/posts/' + parent.id, {
        method: 'PUT',
        body: JSON.stringify({
            "liked": true
        })
    })
}