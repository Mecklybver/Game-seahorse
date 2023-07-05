import { scale } from "../script2.js";

export  class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25 * scale;
        this.fontFamily = "Bangers";
        this.color = "white"
        this.x = 20;
        this.y = 40
        this.lifeIconX = 0;
        this.lifeIconY = 10;
        this.frameY = this.game.player.frameY
        this.frameX = this.game.player.frameX
        this.maxFrame = this.game.player.maxFrame
        this.width = 120;
        this.height = 190;
        this.powerUp = this.game.player.powerUp
        this.previousPlayers = this.game.player.previousPlayers
        this.elapsedTime = 0
        this.shield = this.game.player.shield
        this.frameXshield = this.game.shield.frameX
        this.maxFrameShield = this.game.shield.maxFrame
        this.shieldImage = this.game.shield.image



    }
    draw(context) {
        //score
        context.save()
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowColor = "black";
        context.fillStyle = this.color;
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillText(`Score:  ${this.game.score}`, this.x * scale, this.y * scale)
        context.shadowBlur = 3;


        // timer
        const formattedTime = this.game.gameTime * 0.001
        const formattedTimeseconds = (formattedTime % 60).toFixed(1)
        if (formattedTime <= 10) {
            context.fillText(`Timer: 0${formattedTimeseconds}`, 20 * scale, 100 * scale)
        }
        else if (formattedTime <= 60) {
            context.fillText(`Timer: ${formattedTimeseconds}`, 20 * scale, 100 * scale)
        } else {
            const formattedTimeminutes = Math.floor(formattedTime / 60)
            context.fillText(`Timer: ${formattedTimeminutes}:${formattedTimeseconds}`, 20 * scale, 100 * scale)

        }
        context.fillText(`Time limit ${(this.game.timeLimit * 0.00001).toFixed(2)} minutes`, this.game.width - 400 * scale, 80 * scale)
        context.fillText(`Winning Score ${this.game.winningScore} points`, this.game.width - 420 * scale, 110 * scale)


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
            let fontSize = 130
            let fontSize2 = 110
            context.font = `${fontSize * scale}px ${this.fontFamily}`;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 60 * scale);
            context.font = `${fontSize2 * scale}pxpx ${this.fontFamily}`;
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 60 * scale)
        }
        const ammoColor = this.game.player.powerUp ? "#ffffbd" : this.color;
        context.fillStyle = ammoColor;
        for (let i = 0; i < this.game.ammo; i++) {
            context.fillRect(30 + 5 * i * scale, 50 * scale, 3 * scale, 20 * scale)
        }
        context.restore()
        // Player's life level
        const livesIconWidth = 40;
        const livesIconHeight = 40;
        const livesSpacing = 10;

        for (let i = 0; i < this.game.player.lives; i++) {
            this.lifeIconX = context.canvas.width * 0.5 + (i + 1) * (livesIconWidth * scale + livesSpacing * scale);
            this.lifeIconY = 10 + Math.sin((this.elapsedTime + i * 200) / 300) * 5;

            const staggeredFrameXshield = (this.frameXshield + i * 2) % this.maxFrameShield;



            context.drawImage(
                this.game.player.imgPlayer,
                this.frameX * this.width,
                this.frameY * this.height,
                this.game.player.width,
                this.game.player.height,
                this.lifeIconX,
                this.lifeIconY,
                livesIconWidth * scale,
                livesIconHeight * scale)

            if (this.shield) {
                context.drawImage(
                    this.shieldImage,
                    staggeredFrameXshield * this.width,
                    0,
                    this.game.player.width,
                    this.game.player.height,
                    this.lifeIconX,
                    this.lifeIconY,
                    livesIconWidth * scale,
                    livesIconHeight * scale)
            }
        }


    }
    update(deltaTime) {
        this.shield = this.game.player.shield
        this.powerUp = this.game.player.powerUp
        this.frameY = this.game.player.frameY
        this.previousPlayers = this.game.player.previousPlayers
        this.elapsedTime += deltaTime
        this.lifeIconY = 10 + Math.sin(0.001 * this.elapsedTime) * 5



        this.frameXshield++;
        this.frameXshield %= this.maxFrameShield;



        this.frameX++
        this.frameX %= this.maxFrame
    }


}