document.addEventListener('DOMContentLoaded', () => {

    loadPosts();

    const form = document.getElementById('new-post');
    form.onsubmit = () => createNewPost();

});

function loadPosts() {
    const container = document.getElementById('posts-container');
    // Clear container before populating it
    container.innerHTML = '';

    // Clear textarea after posting
    document.getElementById('new-post-text').value = '';

    // Get all posts by all users
    fetch('/posts/all')
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => createPost(post, container));
        });
}

function createNewPost() {
    let text = document.getElementById('new-post-text').value;

    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            text: text
        })
    })
        .then(response => response.json())
        .then(() => loadPosts())

    return false;
}