const editablePosts = document.querySelectorAll('.edit');

editablePosts.forEach(form => {
    form.onsubmit = () => editPost(form);
})

function editPost(form) {
    const postId = form.id;

    // Find parent element
    const parent = form.parentElement;

    // Find text within parent
    const postText = parent.querySelector('.post-text');

    // Save then delete text content
    let text = postText.innerHTML;
    postText.innerHTML = '';

    // Replace text into textarea
    let textarea = document.createElement('textarea');
    parent.append(textarea);
    textarea.value = text;

    return false;
}