import { scale } from "../script2.js";


class Explosion {
    constructor(game, x, y) {
        this.game = game;
        this.spriteHeight = 200;
        this.spriteWidth = 200;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.fps = 10;
        this.timer = 0;
        this.interval = 1000 / this.fps;
        this.markedForDeletion = false;
        this.maxFrame = 8;
    }

    update(deltaTime) {
        this.x -= this.game.speed;
        if (this.timer > this.interval) {
            this.frameX++;
        } else {
            this.timer += deltaTime;
        }
        if (this.frameX > this.maxFrame) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y,
            this.width * scale,
            this.height * scale
        );
    }
}

class SmokeExplosion extends Explosion {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = new Image();
        this.image.src = "./effects/smokeExplosion.png";
    }
}


class FireExplosion extends Explosion {
    constructor(game, x, y) {
        super(game, x, y);
        this.image = new Image();
        this.image.src = "./effects/fireExplosion.png";
        this.fps = 2
    }
}

export {
    SmokeExplosion,
    FireExplosion
}