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
