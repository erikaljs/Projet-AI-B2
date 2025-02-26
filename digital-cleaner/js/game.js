window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let isLidOpen = false;
    let mouseX = 0;
    let mouseY = 0;

    function drawTrashCan(x, y) {
        // Dessiner le corps de la poubelle
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 16, y + 24, 32, 30);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#c0392b';
        ctx.strokeRect(x + 16, y + 24, 32, 30);

        // Dessiner le couvercle de la poubelle
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
        isLidOpen = checkMouseOverTrashCan(100, 100, mouseX, mouseY);
        draw();
    });

    canvas.addEventListener('mouseout', function() {
        isLidOpen = false;
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrashCan(100, 100);
        // Dessiner tous les emails
        emailPopups.forEach(popup => {
            if (popup.type === 'normal') {
                ctx.fillStyle = 'blue';
            } else if (popup.type === 'piece_jointe') {
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = 'grey';
            }
            ctx.fillRect(popup.x, popup.y, popup.width, popup.height);
        });
        // Dessiner la jauge de pollution
        pollutionGauge.draw(ctx);
    }

    // Initialisation et ajout d'un email toutes les 1.5 secondes
    const emailPopups = [];
    let score = 0; // Nombre d'emails supprimés
    let totalCO2Deleted = 0; // Total de CO2 supprimé (en g)
    let gameOver = false;
    let pollutionLevel = 0; // Niveau de pollution
    const maxPollutionLevel = 200; // Niveau max ajusté

    const emailTypes = {
        normal: 4,         // 4g CO2 pour un mail normal
        piece_jointe: 50,  // 50g CO2 pour un mail avec pièce jointe
        spam: 0.3          // 0.3g CO2 pour un spam
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
            // Calculer la pollution en fonction du type de mail
            this.co2 = emailPopups.reduce((total, email) => total + emailTypes[email.type], 0);
            this.level = Math.min((this.co2 / this.maxCO2) * this.width, this.width);
        }

        getColor() {
            const ratio = this.co2 / this.maxCO2;

            // Plus la pollution augmente, plus la couleur devient rouge
            if (ratio < 0.33) {
                return 'green';  // Faible pollution, vert
            } else if (ratio < 0.66) {
                return 'yellow'; // Pollution modérée, jaune
            } else {
                return 'red';    // Forte pollution, rouge
            }
        }

        draw(ctx) {
            const color = this.getColor(); // Couleur dynamique selon le CO2
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.level, this.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'white';
            ctx.fillText(`${this.co2.toFixed(1)} g CO₂`, this.x + 5, this.y + 15);
        }
    }

    const pollutionGauge = new PollutionGauge(maxPollutionLevel);

    function init() {
        // Ajout d'un email toutes les 1.5 secondes
        setInterval(addEmailPopup, 1500); // Ajoute un email toutes les 1.5 secondes
        canvas.addEventListener('click', removeEmail);
        requestAnimationFrame(gameLoop);
    }

    function addEmailPopup() {
        if (!gameOver) {
            // Choisir un type de mail aléatoire
            const randomType = ['normal', 'piece_jointe', 'spam'][Math.floor(Math.random() * 3)];
            emailPopups.push({
                x: Math.random() * (canvas.width - 50),
                y: Math.random() * (canvas.height - 30),
                width: 50,
                height: 30,
                dx: (Math.random() * 2) + 1,
                dy: (Math.random() * 2) + 1,
                type: randomType // Assigner un type au mail
            });
        }
    }

    function removeEmail(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = 0; i < emailPopups.length; i++) {
            const popup = emailPopups[i];
            if (
                mouseX >= popup.x && mouseX <= popup.x + popup.width &&
                mouseY >= popup.y && mouseY <= popup.y + popup.height
            ) {
                // Ajouter la quantité de CO2 supprimée
                totalCO2Deleted += emailTypes[popup.type];
                emailPopups.splice(i, 1);
                score++;
                document.getElementById("score").textContent = `Emails supprimés : ${score}`;
                document.getElementById("co2-deleted").textContent = `CO₂ supprimé : ${totalCO2Deleted.toFixed(1)} g`;
                return;
            }
        }
    }

    function update() {
        // Si la pollution atteint la limite, le jeu est terminé
        if (emailPopups.reduce((total, email) => total + emailTypes[email.type], 0) >= maxPollutionLevel) {
            gameOver = true;
            document.getElementById("game-over").style.display = "block";
            return;
        }

        // Mettre à jour la position des emails
        emailPopups.forEach(popup => {
            popup.x += popup.dx;
            popup.y += popup.dy;

            // Vérifier les bords du canvas pour inverser la direction des emails
            if (popup.x < 0 || popup.x + popup.width > canvas.width) popup.dx *= -1;
            if (popup.y < 0 || popup.y + popup.height > canvas.height) popup.dy *= -1;
        });

        // Mettre à jour la jauge de pollution
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
};
