document.addEventListener('DOMContentLoaded', () => {
    
    const follow_button = document.getElementById('follow');
    const user_id = document.getElementById('user-id').textContent;

    follow_button.addEventListener('click', (event) => follow(event, user_id))
});

function follow(event, user_id) {
    let button = event.target;

    let follow = button.innerHTML === 'Follow';

    if (follow) {
        button.innerHTML = 'Unfollow';
    } else {
        button.innerHTML = 'Follow';
    }

    fetch('/users/' + user_id, {
        method: 'PUT',
        body: JSON.stringify({
            "follow": follow
        })
    })
        .then(() => {
            updateFollowerCount(user_id);
        })
        .catch(error => console.error(error));
}

function updateFollowerCount(user_id) {

    fetch('/users/' + user_id)
        .then(response => response.json())
        .then(user => {
            document.getElementById('follower-count').textContent = user.followers.length;
        });
}