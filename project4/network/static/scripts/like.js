document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.btn-like');

    likeButtons.forEach(button => {

        // If user has already liked the post
        if (button.parentElement.querySelector('input')) {
            button.querySelector('svg').classList.add('liked');
        }

        button.addEventListener('click', () => likePost(button));
    })
})

function likePost(button) {

    let svg = button.querySelector('svg')
    svg.classList.toggle('liked');

    let liked = svg.classList.contains('liked');
    
    // Find parent element
    const parent = button.parentElement;

    let likes = parent.querySelector('.likes').textContent;

    if (liked) likes++;
    else likes --;

    parent.querySelector('.likes').textContent = likes;
    
    fetch('/posts/' + parent.id, {
        method: 'PUT',
        body: JSON.stringify({
            "liked": liked
        })
    })
        .then(response => console.log(response.json()));
}