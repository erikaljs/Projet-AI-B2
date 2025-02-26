const dragDiv = document.querySelector(".movable");
let isDragging = false;
let offsetX = 0, offsetY = 0;

dragDiv.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragDiv.style.cursor = "grabbing";

    // Capturer la position exacte du clic sur la div
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    e.preventDefault(); // Empêcher les comportements par défaut
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    // Mettre à jour la position sans décalage
    dragDiv.style.left = `${x}px`;
    dragDiv.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    dragDiv.style.cursor = "grab";
});