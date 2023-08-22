document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.btn-edit');

    editButtons.forEach(button => {
        button.addEventListener('click', () => editPost(button));
    })
})

function editPost(button) {

    // Find parent element
    const parent = button.parentElement;

    // Find text within parent
    const postText = parent.querySelector('.post-text');

    // Save then delete text content
    let text = postText.innerHTML;
    postText.innerHTML = '';

    // Replace text into textarea
    const textarea = parent.querySelector('textarea');
    textarea.style.display = 'block';
    textarea.value = text;

    // Hide edit button and show save button
    button.style.display = 'none';
    const saveButton = parent.querySelector('.btn-save');
    saveButton.style.display = 'inline';

    saveButton.addEventListener('click', () => savePost(saveButton));
}

function savePost(button) {
    const parent = button.parentElement;

    // Take text from textarea then hide it
    const textarea = parent.querySelector('textarea');
    const text = textarea.value;
    textarea.style.display = 'none';

    // Make PUT request to save changes in DB
    fetch('/posts/' + parent.id, {
        method: 'PUT',
        body: JSON.stringify({
            "text": text
        })
    })
        .then(response => response.json())

    // Hide save button and show edit button
    button.style.display = 'none';
    parent.querySelector('.btn-edit').style.display = 'inline';

    // Display text in div
    parent.querySelector('.post-text').innerHTML = text;
}