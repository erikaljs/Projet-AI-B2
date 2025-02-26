document.addEventListener('keydown', function(event) {
    if (event.key === 'p') {
        showPopup();
    }
});


const messages = [
    "🎉 Vous avez gagné un iPhone 48 pro !",
    "💥 Emilie t'attends à 200m ! Clique pour voir sa localisation ",
    "💻 Tu t'ennuies ? Elle aussi",
    "🔥 Prévision météo : Grand soleil sur Bordeaux \n Chat de Sophie : Il pleut chez moi tu viens quand même? !",
    "📩 Emma célibataire attend ta réponse",,
    "📢 Macron accusé de détournement de fond : lisez l'article !",
    "📞 Une inconnue veut vous contacter, cliquez ici pour voir qui c'est !",

];

function showPopup() {
    // Créer la pop-up si elle n'existe pas déjà
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.style.position = 'absolute';
    popup.style.top = `${Math.random() * (window.innerHeight - 200)}px`;
    popup.style.left = `${Math.random() * (window.innerWidth - 300)}px`;

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Ajouter le texte et le bouton
    const heading = document.createElement('h3');
    heading.textContent = randomMessage;
    const button = document.createElement('button');
    button.textContent = "Cliquez pour gagner encore plus!";
    
    // Ajouter l'événement au bouton
    button.addEventListener('click', function() {
        showPopup(); // Appeler à nouveau la fonction pour créer une nouvelle pop-up
    });
    
    // Ajouter tout à la pop-up
    popup.appendChild(heading);
    popup.appendChild(button);

    // Ajouter la pop-up au body
    document.body.appendChild(popup);
    
    // Afficher la pop-up
    popup.style.display = 'block';

    // Faire disparaître la pop-up après 5 secondes
    setTimeout(() => {
        popup.style.display = 'none';
        document.body.removeChild(popup); // Enlever la pop-up après qu'elle disparaisse
    }, 5000);
}

window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let isLidOpen = false;
    let mouseX = 0;
    let mouseY = 0;

    let draggedEmail = null; // Email en cours de déplacement
    let trashCanX = 100;
    let trashCanY = 100;

    function updateTrashCanPosition() {
        trashCanX = Math.random() * (canvas.width - 48); // 48 est la largeur de la poubelle
        trashCanY = Math.random() * (canvas.height - 54); // 54 est la hauteur de la poubelle
    }

    function drawTrashCan(x, y) {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 16, y + 24, 32, 30);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#c0392b';
        ctx.strokeRect(x + 16, y + 24, 32, 30);

        ctx.fillStyle = '#c0392b';
        if (isLidOpen) {
            ctx.fillRect(x + 12, y, 40, 6);
            ctx.fillRect(x + 26, y - 4, 12, 4);
        } else {
            ctx.fillRect(x + 12, y + 12, 40, 6);
            ctx.fillRect(x + 26, y + 8, 12, 4);
        }
    }

    function checkMouseOverTrashCan(x, y, mouseX, mouseY) {
        return mouseX >= x + 16 && mouseX <= x + 48 && mouseY >= y + 24 && mouseY <= y + 54;
    }

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;

        // Si un email est en cours de déplacement, mettez-le à jour
        if (draggedEmail) {
            draggedEmail.x = mouseX - draggedEmail.width / 2;
            draggedEmail.y = mouseY - draggedEmail.height / 2;
            isLidOpen = checkMouseOverTrashCan(trashCanX, trashCanY, draggedEmail.x + draggedEmail.width / 2, draggedEmail.y + draggedEmail.height / 2);
        } else {
            isLidOpen = checkMouseOverTrashCan(trashCanX, trashCanY, mouseX, mouseY);
        }

        draw();
    });

    canvas.addEventListener('mouseout', function() {
        isLidOpen = false;
        draw();
    });

    function drawEmail(popup) {
        ctx.fillStyle = popup.type === 'normal' ? '#3498db' : popup.type === 'piece_jointe' ? '#e74c3c' : '#95a5a6';
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.moveTo(popup.x + 10, popup.y);
        ctx.lineTo(popup.x + popup.width - 10, popup.y);
        ctx.quadraticCurveTo(popup.x + popup.width, popup.y, popup.x + popup.width, popup.y + 10);
        ctx.lineTo(popup.x + popup.width, popup.y + popup.height - 10);
        ctx.quadraticCurveTo(popup.x + popup.width, popup.y + popup.height, popup.x + popup.width - 10, popup.y + popup.height);
        ctx.lineTo(popup.x + 10, popup.y + popup.height);
        ctx.quadraticCurveTo(popup.x, popup.y + popup.height, popup.x, popup.y + popup.height - 10);
        ctx.lineTo(popup.x, popup.y + 10);
        ctx.quadraticCurveTo(popup.x, popup.y, popup.x + 10, popup.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = 'transparent'; // Désactiver l'ombre pour les autres éléments

        // Dessiner l'icône d'enveloppe
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('✉️', popup.x + 15, popup.y + 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrashCan(trashCanX, trashCanY);

        emailPopups.forEach(popup => {
            drawEmail(popup);
        });

        if (draggedEmail) {
            drawEmail(draggedEmail);
        }
        pollutionGauge.draw(ctx);
    }

    const emailPopups = [];
    let score = 0;
    let totalCO2Deleted = 0;
    let gameOver = false;
    let pollutionLevel = 0;
    const maxPollutionLevel = 200;

    const emailTypes = {
        normal: 4,
        piece_jointe: Math.random() * (50 - 10) + 10, // Génère un nombre entre 10 et 50
        spam: 0.3
    };
    

    class PollutionGauge {
        constructor(maxCO2) {
            this.co2 = 0;
            this.maxCO2 = maxCO2;
            this.x = 10;
            this.y = 10;
            this.width = 200;
            this.height = 20;
        }

        update() {
            this.co2 = emailPopups.reduce((total, email) => total + emailTypes[email.type], 0);
            this.level = Math.min((this.co2 / this.maxCO2) * this.width, this.width);
        }

        getColor() {
            const ratio = this.co2 / this.maxCO2;
            if (ratio < 0.33) return 'green';
            if (ratio < 0.66) return 'yellow';
            return 'red';
        }

        draw(ctx) {
            const color = this.getColor();
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.level, this.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'white';
            ctx.fillText(`${this.co2.toFixed(1)} g CO₂`, this.x + 5, this.y + 15);
        }
    }

    const pollutionGauge = new PollutionGauge(maxPollutionLevel);

    let totalEmails = 0;

    function addEmailPopup() {
        if (!gameOver) {
            const randomType = ['normal', 'piece_jointe', 'spam'][Math.floor(Math.random() * 3)];
            emailPopups.push({
                x: Math.random() * (canvas.width - 50),
                y: Math.random() * (canvas.height - 30),
                width: 50,
                height: 30,
                dx: (Math.random() * 1) + 0.5, // Vitesse entre 0.5 et 1.5
                dy: (Math.random() * 1) + 0.5, // Vitesse entre 0.5 et 1.5
                type: randomType
            });
            totalEmails++;
            document.getElementById("total-emails").textContent = `Total d'emails : ${totalEmails}`;
        }
    }

    function init() {
        setInterval(addEmailPopup, 2000);
        requestAnimationFrame(gameLoop);
    }

    function update() {
        if (emailPopups.reduce((total, email) => total + emailTypes[email.type], 0) >= maxPollutionLevel) {
            gameOver = true;
            document.getElementById("game-over").style.display = "block";
            return;
        }

        emailPopups.forEach(popup => {
            popup.x += popup.dx;
            popup.y += popup.dy;

            if (popup.x < 0 || popup.x + popup.width > canvas.width) popup.dx *= -1;
            if (popup.y < 0 || popup.y + popup.height > canvas.height) popup.dy *= -1;
        });

        pollutionGauge.update();
    }

    function gameLoop() {
        if (!gameOver) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    init();

    setInterval(updateTrashCanPosition, 5000); // Mettre à jour la position de la poubelle toutes les 5 secondes

    // Gestion du "drag" des emails
    canvas.addEventListener("mousedown", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (let i = 0; i < emailPopups.length; i++) {
            const popup = emailPopups[i];
            if (
                mouseX >= popup.x && mouseX <= popup.x + popup.width &&
                mouseY >= popup.y && mouseY <= popup.y + popup.height
            ) {
                draggedEmail = popup; // Commencer à déplacer cet email
                emailPopups.splice(i, 1); // Retirer l'email de la liste

                // Vérifiez si l'email est un spam et montrez une popup
                if (popup.type === 'spam') {
                    showPopup(); // Afficher la popup
                }
                break;
            }
        }
    });

    canvas.addEventListener("mouseup", () => {
        if (draggedEmail) {
            // Vérifier si l'email est au-dessus de la poubelle et seulement le supprimer si c'est le cas
            if (checkMouseOverTrashCan(trashCanX, trashCanY, draggedEmail.x + draggedEmail.width / 2, draggedEmail.y + draggedEmail.height / 2)) {
                totalCO2Deleted += emailTypes[draggedEmail.type];
                score++;
                document.getElementById("score").textContent = `Emails supprimés : ${score}`;
                document.getElementById("co2-deleted").textContent = `CO₂ supprimé : ${totalCO2Deleted.toFixed(1)} g`;
            } else {
                // Si l'email n'est pas dans la poubelle, on le remet dans la liste des emails
                emailPopups.push(draggedEmail);
            }
            draggedEmail = null; // Réinitialiser l'email en cours de déplacement
        }
    });
};
