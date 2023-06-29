import { scale } from "../script2.js";
export class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.speed = 6;
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
        if(this.game.debug)context.fillRect(this.x, this.y, this.width * scale, this.height *scale)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width * scale, this.height * scale)
    }
}



export class ProjectileEnemy extends Projectile {
    constructor(game, x, y) {
        super(game, x, y);
        this.speed = -9;
    }

    draw(context) {
        context.save();
        context.fillStyle = "red";
        if (this.game.debug) context.fillRect(this.x + this.width * scale, this.y, -this.width * scale, this.height * scale);
        context.scale(-1, 1); // Flip horizontally
        context.drawImage(
            this.image,
            this.frameX * this.width, 0, this.width, this.height,
            -this.x - this.width * scale, this.y, this.width * scale, this.height * scale
        );
        context.restore();
    }
    

    update(deltaTime) {
        this.x += this.speed;

        if (this.timer > this.interval) {
            this.frameX++;
            this.frameX %= this.maxFrame;
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

        if (this.x < this.game.width * 0.03) {
            this.markedForDeletion = true;
        }
    }
}