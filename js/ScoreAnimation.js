import { scale } from "../script2.js";

export class ScoreAnimation {
    constructor(game, x, y, score, takePoints) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.score = score;
        this.speedY = -1;
        this.speedX = -1
        this.speed = 0.1
        this.alpha = 1;
        this.markedForDeletion = false;
        this.elapsedTime = 0;
        this.takePoints = takePoints
        this.amplitude = 20

    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;

        const targetX = 70 * scale;
        const targetY = 30 * scale;

        const distance = Math.hypot(targetX - this.x, targetY - this.y);


        if (distance > 1) {
            const moveX = (targetX - this.x) * this.speed;
            const moveY = (targetY - this.y) * this.speed;
            this.x += moveX + Math.cos(0.01 * this.elapsedTime) * this.amplitude;
            this.y += moveY + Math.sin(0.01 * this.elapsedTime) * this.amplitude
            this.amplitude -= 0.15
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
            context.font = "40px Arial";
            context.fillText(`+${this.score}`, this.x, this.y);
            // context.strokeText(`-${this.score}`, this.x, this.y);

            context.restore();
        }
        if (this.takePoints) {
            context.save();
            context.globalAlpha = this.alpha;
            context.fillStyle = "white";
            context.strokeStyle = "red"
            context.font = "40px Arial";
            context.fillText(`-${this.score}`, this.x, this.y);
            context.strokeText(`-${this.score}`, this.x, this.y);

            context.restore();
        }
    }
}