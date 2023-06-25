import {Projectile} from "./Projectile.js"


export class Player {
    constructor(game) {
        this.game = game;
        this.width = 120;
        this.height = 190;
        this.x = 20;
        this.y = 100;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 37;
        this.speedY = 0;
        this.speedX = 0;
        this.maxSpeed = 2;
        this.projectiles = [];
        this.imgPlayer = new Image();
        this.imgPlayer.src = "./player/player.png";
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.powerUpLimit = 12000;
        this.elapsedTime = 0;
        this.shootDelay = 150;
        this.lastShoot = 0;
        this.lives = 10;
        this.shield = false;
        this.alpha = 1;
        this.previousPlayers = [];
    }

    update(deltaTime) {
        this.lastShoot += deltaTime;
        if (this.powerUp) {

            if (this.alpha > 0.2) {
                this.alpha -= 0.01;
                this.alpha = Math.max(this.alpha, 0);
            }
        }

        if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
        else if (this.game.keys.includes("ArrowDown")) this.speedY = this.maxSpeed;
        else this.speedY = 0;
        this.elapsedTime += deltaTime;
        this.y += (this.speedY * deltaTime) * 0.1 + Math.sin(0.01 * this.elapsedTime);

        if (this.game.keys.includes("ArrowLeft")) this.speedX = -this.maxSpeed;
        else if (this.game.keys.includes("ArrowRight")) this.speedX = this.maxSpeed;
        else this.speedX = 0;
        if (this.game.keys.includes(" ")) this.shootTop();
        this.x += (this.speedX * deltaTime) * 0.1;

        if (this.powerUp) {
            this.previousPlayers.push({
                x: this.x,
                y: this.y,
                alpha: this.alpha
            });

            if (this.previousPlayers.length > 25) {
                this.previousPlayers.shift();
            }
        }

        this.projectiles.forEach(projectile => {
            projectile.update(deltaTime);
        });
        this.projectiles = this.projectiles.filter(projectile => {
            return !projectile.markedForDeletion;
        });

        // Frame animation
        this.frameX++;
        this.frameX %= this.maxFrame;

        // Power
        if (this.powerUp) {
            if (this.powerUpTimer > this.powerUpLimit) {
                this.powerUpTimer = 0;
                this.powerUp = false;
                this.frameY = 0;
                this.shootDelay = 150;
                this.previousPlayers = [];
                if (this.game.gameSound) this.game.sound.powerDown();
            } else {
                this.powerUpTimer += deltaTime;
                this.frameY = 1;
                this.game.ammo += 0.03;
                if (this.game.ammo !== this.game.maxAmmo) this.game.ammoInterval = 600;
                if (this.game.ammo > this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
            }
        } else {
            this.frameY = 0;
        }
    }

    draw(context) {
        context.save();

        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);

        this.projectiles.forEach(projectile => {
            projectile.draw(context);
        });

        if (this.powerUp) {
            this.previousPlayers.forEach(prevPlayer => {
                context.globalAlpha = prevPlayer.alpha;
                context.drawImage(
                    this.imgPlayer,
                    this.frameX * this.width,
                    this.frameY * this.height,
                    this.width,
                    this.height,
                    prevPlayer.x,
                    prevPlayer.y,
                    this.width,
                    this.height
                );
            });
        }

        context.globalAlpha = 1;
        context.drawImage(
            this.imgPlayer,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        context.restore();
    }



    shootTop() {
        if (this.game.ammo > 0 && this.lastShoot > this.shootDelay) {
            this.lastShoot = 0;
            if (this.game.gameSound) this.game.sound.shot()
            this.projectiles.push(new Projectile(this.game, this.x + 100, this.y + 30))
            this.game.ammo--;
            if (this.powerUp) this.shootBottom();
        }

    }
    shootBottom() {

        this.projectiles.push(new Projectile(this.game, this.x + 100, this.y + 175))

    }
    enterPowerUp() {
        this.powerUpTimer = 0;
        this.powerUp = true;
        this.game.ammo = this.game.maxAmmo;
        this.shootDelay = 100
        if (this.game.gameSound) this.game.sound.powerUp()
    }
}
