
export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = "Helvetica";
        this.color = "white"
        this.x = 20;
        this.y = 40
        this.lifeIconX = 0;
        this.lifeIconY = 0;

    }
    draw(context) {

        //score
        context.save()
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = "black";
        context.fillStyle = this.color;
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillText(`Score:  ${this.game.score}`, this.x, this.y)
        context.shadowBlur = 3;


        // timer
        const formattedTime = this.game.gameTime * 0.001
        const formattedTimeseconds = (formattedTime % 60).toFixed(1)
        if (formattedTime <= 60) {
            context.fillText(`Timer: ${formattedTimeseconds}`, 20, 100)
        } else {
            const formattedTimeminutes = Math.floor(formattedTime / 60)
            context.fillText(`Timer: ${formattedTimeminutes}:${formattedTimeseconds}`, 20, 100)

        }
        context.fillText(`Time limit ${(this.game.timeLimit * 0.00001).toFixed(2)} minutes`, this.game.width - 400, 80)
        context.fillText(`Winning Score ${this.game.winningScore} points`, this.game.width - 420, 110)


        //gameOver message
        if (this.game.gameOver) {
            context.textAlign = "center";
            let message1;
            let message2;
            if (this.game.score > this.game.winningScore) {
                message1 = "You Win!";
                message2 = "Well done!!"
            } else {
                this.game.background.layers.splice(0, 1);
                message1 = "You lose!";
                message2 = "Try again next time!";
            }
            context.font = `50px ${this.fontFamily}`;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
            context.font = `25px ${this.fontFamily}`;
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40)
        }
        const ammoColor = this.game.player.powerUp ? "#ffffbd" : this.color;
        context.fillStyle = ammoColor;
        for (let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i, 50, 3, 20)
        }
        context.restore()
        // Player's life level
        const livesIconWidth = 40;
        const livesIconHeight = 40;
        const livesSpacing = 10;

        for (let i = 0; i < this.game.player.lives; i++) {
            this.lifeIconX = context.canvas.width * 0.5 + (i + 1) * (livesIconWidth + livesSpacing);
            this.lifeIconY = 10;

            context.drawImage(
                this.game.player.imgPlayer,
                0, // First frame X position
                0, // First frame Y position
                this.game.player.width,
                this.game.player.height,
                this.lifeIconX,
                this.lifeIconY,
                livesIconWidth,
                livesIconHeight)
        }

    }
    update(deltaTime) {
        this.lifeIconY += Math.sin(deltaTime) * 100000
    }
}
