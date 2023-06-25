export class Confetti {
    constructor(game) {
        this.game = game;
        this.radius = Math.random() * 8 + 2;
        this.colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 3 + 1;
        this.rotation = Math.random() * 4;
        this.maxGrowth = 0.5
        this.minGrowth = 0.01
        this.growth = Math.random() * this.maxGrowth + this.minGrowth
        this.alpha = 1;
        this.fall = Math.random() * 0.1 + 0.002


        this.x = Math.random() * this.game.width;
        this.y = Math.random() * this.game.height * 0.3;
    }

    update(deltaTime) {

        this.x += Math.cos(this.angle + deltaTime) * this.speed;
        this.y += (this.fall * deltaTime) + Math.sin(this.angle + deltaTime) * this.speed;
        this.angle += this.rotation * 0.1;
        this.radius += this.growth
        if (this.radius >= this.maxGrowth + this.minGrowth || this.radius <= this.minGrowth) this.growth *= -1

        this.alpha -= 0.005;
        if (this.alpha <= 0) {
            this.alpha = 0;
        }
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.alpha;

        // Draw confetti piece as a circle
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();

        // Randomly select a color from the colors array
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        context.fillStyle = color;
        context.fill();

        context.restore();
    }
}
