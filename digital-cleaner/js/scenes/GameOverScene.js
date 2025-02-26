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
