function create_element(content, className, parent) {
    let element = document.createElement('div');
    element.innerHTML = content;
    element.classList.add(className);
    parent.append(element);
}

function create_post(post, container) {
    let post_container = document.createElement('div');
    create_element(`<a href='user/${post.user}'>${post.user}</a>`, 'post-user', post_container);
    create_element(post.text, 'post-text', post_container);
    create_element(post.date, 'post-date', post_container);
    post_container.classList.add('post-container');
    container.append(post_container);
}