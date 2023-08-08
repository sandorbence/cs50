if (document.getElementById("watchlist")) {
    button = document.getElementById("btn-watchlist");
    button.classList.add("watching");
    button.addEventListener("mouseover", () => {
        button.classList.remove("btn-secondary")
        button.innerHTML = "Remove from watchlist"
    })
    button.addEventListener("mouseleave", () => {
        button.innerHTML = "Watching!"
    })
}

if (document.getElementById("message")) {
    setTimeout(() => {
        document.getElementById("message").remove();
    }, 3000);
}