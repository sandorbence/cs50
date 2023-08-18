const container = document.getElementById('posts-container');

fetch('posts/all')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => create_post(post, container));
    })
