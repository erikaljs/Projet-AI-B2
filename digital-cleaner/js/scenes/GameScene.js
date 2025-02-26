class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        this.score = 0;
        this.co2 = 0;

        this.trash = this.add.image(700, 500, "trash").setInteractive();
        this.trash.setScale(0.5);

        this.email = this.add.image(400, 100, "email").setInteractive();
        this.email.setScale(0.2);
        this.input.setDraggable(this.email);

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
            }
        });

        this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "20px", fill: "#fff" });
    }

    updateScore() {
        this.scoreText.setText("Score: " + this.score);
    }
}
