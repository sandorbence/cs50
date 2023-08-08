function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagePreview = document.getElementById("image-preview");
            imagePreview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById("listing-image").addEventListener("change", function () {
    readURL(this);
});