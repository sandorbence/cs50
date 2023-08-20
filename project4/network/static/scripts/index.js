document.addEventListener('DOMContentLoaded', () => {

    load_posts()

    const form = document.getElementById('new-post');
    form.onsubmit = () => create_new_post();

});

function load_posts() {
    const container = document.getElementById('posts-container');
    // Clear container before populating it
    container.innerHTML = '';

    // Clear textarea after posting
    document.getElementById('new-post-text').value = '';

    // Get all posts by all users
    fetch('/posts/all')
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => create_post(post, container));
        });
}

function create_new_post() {
    let text = document.getElementById('new-post-text').value;

    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            text: text
        })
    })
        .then(response => response.json())
        .then(() => load_posts())

    return false;
}