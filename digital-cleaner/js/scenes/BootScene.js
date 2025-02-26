class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("email", "assets/images/email.png");
        this.load.image("trash", "assets/images/trash.png");
        this.load.image("popup", "assets/images/popup.png");
        this.load.image("cache", "assets/images/cache.png");
        this.load.audio("delete", "assets/sounds/delete.wav");
        this.load.audio("alert", "assets/sounds/alert.wav");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
