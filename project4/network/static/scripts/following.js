const container = document.getElementById('posts-container');

fetch('posts/following')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => create_post(post, container));
    })
