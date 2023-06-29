import { scale } from "../script2.js";

export class ScoreAnimation {
    constructor(game, x, y, score, takePoints) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.score = score;
        this.speed = 0.1
        this.alpha = 1;
        this.markedForDeletion = false;
        this.elapsedTime = 0;
        this.takePoints = takePoints
        this.amplitude = 20
        this.font = 80
        this.elapsedTime = 0

    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;

        const targetX = 70 * scale;
        const targetY = 30 * scale;

        const distance = Math.hypot(targetX - this.x, targetY - this.y);
        if (this.elapsedTime <= 400) {
            this.y-= 2
        }
        else if (distance > 1 && this.elapsedTime >= 400) {
            const moveX = (targetX - this.x) * this.speed;
            const moveY = (targetY - this.y) * this.speed;
            this.x += moveX + Math.cos(0.01 * this.elapsedTime) * this.amplitude;
            this.y += moveY + Math.sin(0.01 * this.elapsedTime) * this.amplitude
            this.amplitude -= Math.random() * 1 + 0.10
            this.font -= 1

        }

        this.alpha -= 0.009;
        if (this.alpha <= 0) {
            this.alpha = 0;
        }
        if (this.alpha <= 0) this.markedForDeletion = true;
    }


    draw(context) {
        if (!this.takePoints) {
            context.save();
            context.globalAlpha = this.alpha;
            context.fillStyle = "white";
            context.strokeStyle = "yellow";
            context.font = `${this.font}px Arial`;
            context.fillText(`+${this.score}`, this.x, this.y);
            // context.strokeText(`-${this.score}`, this.x, this.y);

            context.restore();
        }
        if (this.takePoints) {
            context.save();
            context.globalAlpha = this.alpha;
            context.fillStyle = "white";
            context.strokeStyle = "red"
            context.font = `${this.font}px Arial`;
            context.fillText(`-${this.score}`, this.x, this.y);
            context.strokeText(`-${this.score}`, this.x, this.y);

            context.restore();
        }
    }
}