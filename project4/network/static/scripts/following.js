const container = document.getElementById('posts-container');

fetch('posts/following')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => create_post(post));
    })

function create_post(post) {
    let element = document.createElement('div');
    element.innerHTML = post.text;
    container.append(element);
}