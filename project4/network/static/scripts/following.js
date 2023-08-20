const container = document.getElementById('posts-container');

fetch('posts/following')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => createPost(post, container));
    })
