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

// Emails draggables
let emails = [];
let emailWidth = 50;
let emailHeight = 50;

// Position de la corbeille
let trash = { x: 700, y: 500, width: 100, height: 100 };

// Fonction pour générer des positions aléatoires
function getRandomPosition(maxWidth, maxHeight, width, height) {
    return {
        x: Math.random() * (maxWidth - width),
        y: Math.random() * (maxHeight - height)
    };
}

// Ajouter un nouvel email
function addEmail() {
    let position = getRandomPosition(canvas.width, canvas.height, emailWidth, emailHeight);
    emails.push({ x: position.x, y: position.y, width: emailWidth, height: emailHeight, dragging: false });
}

// Déplacer la corbeille à une position aléatoire
function moveTrash() {
    let position = getRandomPosition(canvas.width, canvas.height, trash.width, trash.height);
    trash.x = position.x;
    trash.y = position.y;
}

// Gestion du drag & drop
canvas.addEventListener("mousedown", (e) => {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    emails.forEach(email => {
        if (mouseX > email.x && mouseX < email.x + email.width && mouseY > email.y && mouseY < email.y + email.height) {
            email.dragging = true;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    emails.forEach(email => {
        if (email.dragging) {
            email.x = e.offsetX - email.width / 2;
            email.y = e.offsetY - email.height / 2;
        }
    });
});

canvas.addEventListener("mouseup", () => {
    emails.forEach(email => {
        if (email.dragging) {
            // Vérifie si l'email est dans la corbeille
            if (email.x > trash.x && email.x < trash.x + trash.width && email.y > trash.y && email.y < trash.y + trash.height) {
                score += 10;
                co2 = Math.max(0, co2 - 10);
                email.x = Math.random() * 600;
                email.y = Math.random() * 400;
                emails = emails.filter(e => e !== email); // Supprimer l'email
            }
            email.dragging = false;
        }
    });
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

// Ajouter un email toutes les 5 secondes
setInterval(() => {
    addEmail();
    moveTrash();
}, 5000);

// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les emails
    emails.forEach(email => {
        ctx.drawImage(emailImg, email.x, email.y, email.width, email.height);
    });

    // Dessiner la corbeille
    ctx.drawImage(trashImg, trash.x, trash.y, trash.width, trash.height);

    // Afficher le score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(draw);
}

// Démarrer l'animation après 5 secondes
setTimeout(() => {
    addEmail();
    draw();
}, 5000);
