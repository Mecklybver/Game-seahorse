export class Particle {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.imageGear = new Image();
        this.imageGear.src = "./player/gears.png"
        this.direction = Math.floor(Math.random() * 2) * 2 - 1
        this.frameX = Math.floor(Math.random() * 3 * this.direction)
        this.frameY = Math.floor(Math.random() * 3)
        this.spriteSize = 50;
        this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1)
        this.size = this.spriteSize * this.sizeModifier
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * -15;
        this.gravity = 0.5;
        this.markedForDeletion = false;
        this.angle = 0;
        this.va = Math.random() * .1 * -this.direction
        this.bounced = false;
        this.bottomBounceBoundary = Math.random() * 70 + 15
    }
    update() {
        this.angle += this.va;
        this.speedY += this.gravity;
        this.x -= this.speedX;
        this.y += this.speedY
        if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true
        if (this.y > this.game.height - this.bottomBounceBoundary && !this.bounced) {
            this.bounced = true
            this.speedY *= -0.5
        }
    }
    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(this.angle)
        context.drawImage(this.imageGear, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size)
        context.restore()
    }
}