import {scale} from "../script2.js"


export class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.speed = 9;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "./effects/projectile.png"
        this.frameX = 0
        this.maxFrame = 3
        this.timer = 0
        this.fps = 10
        this.interval = 1000 / this.fps
    }
    update(deltaTime) {
        this.x += this.speed;

        if (this.timer > this.interval) {
            this.frameX++
            this.frameX %= this.maxFrame
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        if (this.x > this.game.width * 0.97) this.markedForDeletion = true;
    }

    draw(context) {

        context.fillStyle = "yellow"
        // context.fillRect(this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width * scale, this.height * scale)
    }
}