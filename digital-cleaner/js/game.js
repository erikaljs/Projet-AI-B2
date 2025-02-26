// Configuration du jeu
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, MenuScene, GameScene, GameOverScene], // Scènes du jeu
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);

// Classe pour le chargement des assets (images et sons)
class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        // Chargement des assets (images et sons)
        this.load.image("email", "assets/images/email.png");
        this.load.image("trash", "assets/images/trash.png");
        this.load.image("popup", "assets/images/popup.png");
        this.load.image("cache", "assets/images/cache.png");
        this.load.audio("delete", "assets/sounds/delete.wav");
        this.load.audio("alert", "assets/sounds/alert.wav");
    }

    create() {
        // Lancement de la scène Menu
        this.scene.start("MenuScene");
    }
}

// Scène du menu
class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create() {
        this.add.text(200, 250, "Digital Cleaner Challenge", { fontSize: "32px", fill: "#39ff14" });
        let playButton = this.add.text(350, 350, "Jouer", { fontSize: "24px", fill: "#ffffff" })
            .setInteractive()
            .on("pointerdown", () => this.scene.start("GameScene"));
    }
}

// Scène du jeu
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        // Variables de jeu
        this.score = 0;
        this.co2 = 0;
        this.maxCO2 = 100;

        // Corbeille
        this.trash = this.add.image(700, 500, "trash").setInteractive();
        this.trash.setScale(0.5);

        // Email à glisser
        this.email = this.add.image(400, 100, "email").setInteractive();
        this.email.setScale(0.2);
        this.input.setDraggable(this.email);

        // Drag & drop pour supprimer les emails
        this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on("dragend", (pointer, gameObject) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(gameObject.getBounds(), this.trash.getBounds())) {
                gameObject.destroy();
                this.sound.play("delete");
                this.score += 10;
                this.updateScore();
                this.reduceCO2();
            }
        });

        // Affichage du score et du CO₂
        this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "20px", fill: "#fff" });
        this.co2Text = document.getElementById("co2");
        this.co2Bar = document.getElementById("co2-fill");

        // Incrémentation du CO₂
        this.time.addEvent({ delay: 1000, callback: this.increaseCO2, callbackScope: this, loop: true });
    }

    // Mise à jour du score
    updateScore() {
        this.scoreText.setText("Score: " + this.score);
    }

    // Augmenter le CO₂
    increaseCO2() {
        this.co2 += 5;
        if (this.co2 >= this.maxCO2) {
            this.gameOver();
        }
        this.updateCO2Bar();
    }

    // Réduire le CO₂
    reduceCO2() {
        this.co2 = Math.max(0, this.co2 - 10);
        this.updateCO2Bar();
    }

    // Mise à jour de la jauge de CO₂
    updateCO2Bar() {
        this.co2Text.innerText = this.co2 + "g";
        this.co2Bar.style.width = (100 - (this.co2 / this.maxCO2) * 100) + "%";
    }

    // Fin du jeu
    gameOver() {
        this.scene.start("GameOverScene");
    }
}

// Scène de fin de jeu
class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    create() {
        this.add.text(200, 250, "Fin du jeu", { fontSize: "32px", fill: "#ff0000" });
        this.add.text(200, 300, "Ton CO₂ a explosé !", { fontSize: "24px", fill: "#ffffff" });
        let restartButton = this.add.text(350, 400, "Rejouer", { fontSize: "24px", fill: "#ffffff" })
            .setInteractive()
            .on("pointerdown", () => this.scene.start("GameScene"));
    }
}
