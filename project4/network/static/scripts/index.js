const container = document.getElementById('posts-container');

fetch('posts/all')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => create_post(post));
    })

function create_post(post) {
    let post_container = document.createElement('div');
    let text = document.createElement('div');
    text.innerHTML = post.text;
    post_container.append(text);
    container.append(post_container);
}