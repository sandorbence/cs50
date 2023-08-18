const user_id = document.getElementById('user-id').innerHTML;
const posts_container = document.getElementById('posts-container');

fetch('/users/' + user_id)
    .then(response => response.json())
    .then(user => {
        user.posts.forEach(post => create_post(post, posts_container));
    })