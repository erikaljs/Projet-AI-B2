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

        // Si un email est en cours de déplacement, mettez-le à jour
        if (draggedEmail) {
            draggedEmail.x = mouseX - draggedEmail.width / 2;
            draggedEmail.y = mouseY - draggedEmail.height / 2;
        } else {
            isLidOpen = checkMouseOverTrashCan(trashCanX, trashCanY, mouseX, mouseY);
        }

        draw();
    });

    canvas.addEventListener('mouseout', function() {
        isLidOpen = false;
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrashCan(trashCanX, trashCanY);

        emailPopups.forEach(popup => {
            ctx.fillStyle = popup.type === 'normal' ? 'blue' : popup.type === 'piece_jointe' ? 'red' : 'grey';
            ctx.fillRect(popup.x, popup.y, popup.width, popup.height);
        });

        if (draggedEmail) {
            ctx.fillStyle = draggedEmail.type === 'normal' ? 'blue' : draggedEmail.type === 'piece_jointe' ? 'red' : 'grey';
            ctx.fillRect(draggedEmail.x, draggedEmail.y, draggedEmail.width, draggedEmail.height);
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
        piece_jointe: 50,
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

    function init() {
        setInterval(addEmailPopup, 1500);
        canvas.addEventListener('click', removeEmail);
        requestAnimationFrame(gameLoop);
    }

    function addEmailPopup() {
        if (!gameOver) {
            const randomType = ['normal', 'piece_jointe', 'spam'][Math.floor(Math.random() * 3)];
            emailPopups.push({
                x: Math.random() * (canvas.width - 50),
                y: Math.random() * (canvas.height - 30),
                width: 50,
                height: 30,
                dx: (Math.random() * 2) + 1,
                dy: (Math.random() * 2) + 1,
                type: randomType
            });
        }
    }

    function removeEmail(event) {
        if (draggedEmail) {
            // Vérifier si l'email est au-dessus de la poubelle
            if (checkMouseOverTrashCan(trashCanX, trashCanY, draggedEmail.x + draggedEmail.width / 2, draggedEmail.y + draggedEmail.height / 2)) {
                totalCO2Deleted += emailTypes[draggedEmail.type];
                emailPopups = emailPopups.filter(email => email !== draggedEmail);
                score++;
                document.getElementById("score").textContent = `Emails supprimés : ${score}`;
                document.getElementById("co2-deleted").textContent = `CO₂ supprimé : ${totalCO2Deleted.toFixed(1)} g`;
            }
            draggedEmail = null; // Réinitialiser le mail en cours de déplacement
        }
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
                break;
            }
        }
    });

    canvas.addEventListener("mouseup", () => {
        if (draggedEmail) {
            // Vérifier si l'email est au-dessus de la poubelle et le supprimer
            if (checkMouseOverTrashCan(trashCanX, trashCanY, draggedEmail.x + draggedEmail.width / 2, draggedEmail.y + draggedEmail.height / 2)) {
                totalCO2Deleted += emailTypes[draggedEmail.type];
                score++;
                document.getElementById("score").textContent = `Emails supprimés : ${score}`;
                document.getElementById("co2-deleted").textContent = `CO₂ supprimé : ${totalCO2Deleted.toFixed(1)} g`;
            }
            draggedEmail = null; // Réinitialiser le mail en cours de déplacement
        }
    });
};
