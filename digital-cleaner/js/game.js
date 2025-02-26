const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Images
const emailImg = new Image();
emailImg.src = "assets/images/email.png";
const trashImg = new Image();
trashImg.src = "assets/images/trash.png";

// Variables du jeu
let score = 0;
let co2 = 0;
let maxCO2 = 100;
let co2Bar = document.getElementById("co2-fill");

// Email draggable
let email = { x: 200, y: 100, width: 50, height: 50, dragging: false };

// Position de la corbeille
let trash = { x: 700, y: 500, width: 100, height: 100 };

// Gestion du drag & drop
canvas.addEventListener("mousedown", (e) => {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    if (mouseX > email.x && mouseX < email.x + email.width && mouseY > email.y && mouseY < email.y + email.height) {
        email.dragging = true;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (email.dragging) {
        email.x = e.offsetX - email.width / 2;
        email.y = e.offsetY - email.height / 2;
    }
});

canvas.addEventListener("mouseup", () => {
    if (email.dragging) {
        // Vérifie si l'email est dans la corbeille
        if (email.x > trash.x && email.x < trash.x + trash.width && email.y > trash.y && email.y < trash.y + trash.height) {
            score += 10;
            co2 = Math.max(0, co2 - 10);
            email.x = Math.random() * 600;
            email.y = Math.random() * 400;
        }
        email.dragging = false;
    }
});

// Fonction pour mettre à jour la barre de CO₂
function updateCO2Bar() {
    co2Bar.style.width = (100 - (co2 / maxCO2) * 100) + "%";
}

// Augmenter le CO₂ toutes les secondes
setInterval(() => {
    co2 += 5;
    if (co2 >= maxCO2) {
        alert("Game Over ! Ton CO₂ a explosé !");
        document.location.reload();
    }
    updateCO2Bar();
}, 1000);

// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner l'email
    ctx.drawImage(emailImg, email.x, email.y, email.width, email.height);

    // Dessiner la corbeille
    ctx.drawImage(trashImg, trash.x, trash.y, trash.width, trash.height);

    // Afficher le score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(draw);
}

// Démarrer l'animation
draw();
