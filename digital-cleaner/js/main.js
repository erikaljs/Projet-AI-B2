const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const emailPopups = [];





let pollutionLevel = 0; // Niveau de pollution
const maxPollutionLevel = 100; // Niveau maximum de pollution






function init() {
    for (let i = 0; i < 5; i++) {
        emailPopups.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: 50,
            height: 30,
            dx: 2, // Vitesse horizontale fixe
            dy: 2  // Vitesse verticale fixe
        });
    }
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    console.log("Update function called");








    // Déplacer les pop-ups
    emailPopups.forEach(popup => {
        popup.x += popup.dx;
        popup.y += popup.dy;

        // Vérifier les collisions avec les bords du canvas
        if (popup.x < 0 || popup.x + popup.width > canvas.width) {
            popup.dx *= -1; // Inverser la direction horizontale
        }
        if (popup.y < 0 || popup.y + popup.height > canvas.height) {
            popup.dy *= -1; // Inverser la direction verticale
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les pop-ups d'e-mails
    emailPopups.forEach(popup => {
        ctx.fillStyle = 'blue'; // Couleur des pop-ups
        ctx.fillRect(popup.x, popup.y, popup.width, popup.height);
    });









    // Calculer le pourcentage de pollution
    const pollutionPercentage = (pollutionLevel / maxPollutionLevel);








    // Déterminer la couleur de la jauge en fonction de la pollution
    let gaugeColor = 'green';
    if (pollutionPercentage >= 0.66) {
        gaugeColor = 'red';    // Forte pollution, rouge
    } else if (pollutionPercentage >= 0.33) {
        gaugeColor = 'yellow'; // Pollution modérée, jaune
    }


    // Dessiner la jauge de pollution
    ctx.fillStyle = gaugeColor; // Utiliser la couleur dynamique
    ctx.fillRect(10, 10, pollutionLevel, 20); // Position et taille de la jauge
    ctx.strokeStyle = 'black';
    ctx.strokeRect(10, 10, maxPollutionLevel, 20); // Bordure de la jauge
}

window.onload = init;
