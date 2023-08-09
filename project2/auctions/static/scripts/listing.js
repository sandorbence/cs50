// If item is added to the watchlist, change the button's style
if (document.getElementById("watchlist")) {
    button = document.getElementById("btn-watchlist");
    button.classList.add("watching");

    // Change button text on hover
    button.addEventListener("mouseover", () => {
        button.innerHTML = "Remove from watchlist"
    })
    button.addEventListener("mouseleave", () => {
        button.innerHTML = "Watching!"
    })
}

// Display message at the top of the page,
// then hide it
if (document.getElementById("message")) {
    setTimeout(() => {
        document.getElementById("message").remove();
    }, 3000);
}