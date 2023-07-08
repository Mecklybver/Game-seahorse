import { scale } from "../script2.js";


export  class Shield {
    constructor(game) {
        this.game = game;
        this.width = this.game.player.width;
        this.height = this.game.player.height;
        this.frameX = 0;
        this.maxFrame = 24;
        this.image = new Image();
        this.image.src = "./effects/shield.png";
        this.timer = 0;
        this.activa
        this.duration = 0;
        this.timeLimit = Math.random() * 8000 + 12000 
        this.fps = 30;
        this.interval = 1000 / this.fps;
    }

    update(deltaTime) {
        if (this.game.player.shield) {
            this.duration += deltaTime;

            if (this.frameX <= this.maxFrame) {
                if (this.timer > this.interval) {
                    this.frameX++;
                    this.timer = 0;
                } else {
                    this.timer += deltaTime;
                }
            }

            if (this.duration >= this.timeLimit) {
                this.game.player.shield = false;
                this.duration = 0;
                this.frameX = 0;
                if (this.game.gameSound){ 
                    this.game.sound.shield();
                    setTimeout(() => {
                        this.game.sound.shield();
                    }, 200);
                    setTimeout(() => {
                        this.game.sound.shield();
                    }, 400);
                }
            }
        }
    }

    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.game.player.x,
            this.game.player.y,
            this.width * scale,
            this.height * scale
        );
    }

    reset() {
        this.frameX = 0;
        if (this.game.gameSound) this.game.sound.shield();
    }
}