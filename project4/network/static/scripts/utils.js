function createElement(content, className, parent) {
    let element = document.createElement('div');
    element.innerHTML = content;
    element.classList.add(className);
    parent.append(element);
}

function createPost(post, container) {
    let post_container = document.createElement('div');
    createElement(`<a href='/user/${post.user}'>${post.user}</a>`, 'post-user', post_container);
    createElement(post.text, 'post-text', post_container);
    createElement(post.date, 'post-date', post_container);
    post_container.classList.add('post-container');
    container.append(post_container);
}