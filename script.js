
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = 1220;
canvas.height = 520;



window.addEventListener("load", e => {


    class ScoreAnimation {
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

            const targetX = 70;
            const targetY = 30;

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

    class Confetti {
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


    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener("keydown", e => {
                if ((e.key === "ArrowUp" ||
                    e.key === "ArrowDown" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === " ")
                    && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === "F2") {
                    this.game.debug = !this.game.debug
                } else if (e.key === "p") {
                    this.game.player.powerUp = !this.game.player.powerUp
                    this.game.player.powerUpLimit = Infinity
                } else if (e.key === "q") {
                    this.game.gameSound = !this.game.gameSound;
                    console.log(this.game.gameSound)
                } else if (e.key === "s") {
                    this.game.player.shield = !this.game.player.shield
                    if (this.game.gameSound) this.game.sound.shield()
                    this.game.shield.reset()
                }

            });
            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }

            });

        }
    }

    class SoundController {
        constructor() {
            this.powerUpSound = new Audio("./sounds/powerup.wav")
            this.explosionSound = new Audio("./sounds/explosion.wav")
            this.hitSound = new Audio("./sounds/hit.wav")
            this.powerDownSound = new Audio("./sounds/powerdown.wav")
            this.shieldSound = new Audio("./sounds/shield.wav")
            this.shotSound = new Audio("./sounds/shot.wav")


        }
        powerUp() {
            this.powerUpSound.currentTime = 0;
            this.powerUpSound.play()
        }
        shot() {
            this.shotSound.currentTime = 0;
            this.shotSound.play()
        }
        powerDown() {
            this.powerDownSound.currentTime = 0;
            this.powerDownSound.play()
        }
        hit() {
            this.hitSound.currentTime = 0;
            this.hitSound.play()
        }
        explosion() {
            this.explosionSound.currentTime = 0;
            this.explosionSound.play()
        }
        shield() {
            this.shieldSound.currentTime = 0;
            this.shieldSound.play()
        }

    }
    class Shield {
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
            this.timeLimit = 12000
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
                    if (this.game.gameSound) this.game.sound.shield();
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
                this.width,
                this.height
            );
        }

        reset() {
            this.frameX = 0;
            if (this.game.gameSound) this.game.sound.shield();
        }
    }

    class Projectile {
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
            // context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
    }
    class Particle {
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
    class Player {
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
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.y;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.speedY = 0
            this.markedForDeletion = false
            this.width = 50;
            this.height = 50;
            this.lives = 5;
            this.score = this.lives
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37
            this.elapsedTime
            this.amplitude = 1
            this.frequency = 0.1
        }

        update(deltaTime) {
            this.elapsedTime += deltaTime
            this.x += this.speedX - this.game.speed;
            this.speedY = Math.sin((this.game.speed + this.x) * this.frequency) * this.amplitude;
            this.y += this.speedY;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            this.frameX++
            this.frameX %= this.maxFrame
        }
        draw(context) {
            context.save()
            context.strokeStyle = "red";
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.imgEnemy,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height)
            context.fillStyle = "black"
            context.font = "30px Helvetica"
            if (this.game.debug) context.fillText(this.lives, this.x, this.y)
            if (this.game.debug) context.fillText(this.type, this.x, this.y + this.height)
            if (this.game.debug) context.fillText(this.frameY, this.x + this.width, this.y + this.height)

            context.restore()
        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/angler1.png"
            this.frameY = Math.floor(Math.random() * 3);
            this.lives = 4;
            this.score = this.lives;
            this.type = "angler1"
            this.amplitude = Math.random() * 1 + 1

        }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/angler2.png"
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 5;
            this.score = this.lives;
            this.type = "angler2"
            this.amplitude = Math.random() * 3 + 1


        }
    }
    class Lucky extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/lucky.png"
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 6;
            this.score = 15;
            this.speedY = Math.sin((this.game.speed + this.x) * 0.9);
            this.amplitude = Math.random() * 3.5 + 0.5

            this.type = "lucky"
        }
    }
    class Hivewhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/hivewhale.png";
            this.frameY = 0
            this.lives = 12;
            this.score = 17;
            this.type = "hivewhale";
            this.speedX = Math.random() * -1.2 - 0.2;
        }
    }
    class Drone extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 115;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/drone.png";
            this.frameY = 0
            this.lives = 3;
            this.score = this.lives;
            this.type = "drone";
            this.speedX = Math.random() * -4.2 - 4;
            this.amplitude = Math.random() * 5 + 3
            this.frequency = 0.15

        }
    }
    class Bulbwhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 270;
            this.height = 219;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/bulbwhale.png";
            this.frameY = Math.floor(Math.random() * 2)
            this.lives = 12;
            this.score = 17;
            this.type = "bulbwhale";
            this.speedX = Math.random() * -1.2 - 0.2;
        }
    }
    class Moonfish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 227;
            this.height = 240;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image()
            this.imgEnemy.src = "./enemies/moonfish.png";
            this.frameY = 0;
            this.lives = 18;
            this.score = 17;
            this.type = "moonfish";
            this.speedX = Math.random() * -1.2 - 2;
        }
    }
    class Stalker extends Enemy {
        constructor(game) {
            super(game);
            this.width = 243;
            this.height = 123;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image();
            this.imgEnemy.src = "./enemies/stalker.png";
            this.frameY = 0;
            this.lives = 7;
            this.score = 20;
            this.type = "stalker";
            this.amplitude = 8;
            this.speedX = -2;
            this.followSpeed = 0.05;
            this.amplitude = 8
            this.frequency = 0.1
        }

        update(deltaTime) {
            this.elapsedTime += deltaTime;
            this.x += this.speedX - this.game.speed;

            // Follow the player's position on the Y-axis
            const targetY = this.game.player.y;
            const deltaY = targetY - this.y;
            this.speedY = Math.sin((this.game.speed + this.x) * this.frequency) * this.amplitude;
            this.y += deltaY * this.followSpeed + this.speedY


            if (this.x + this.width < 0) this.markedForDeletion = true;
            this.frameX++;
            this.frameX %= this.maxFrame;
        }
    }



    class Razorfin extends Stalker {
        constructor(game) {
            super(game);
            this.width = 187;
            this.height = 149;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.imgEnemy = new Image();
            this.imgEnemy.src = "./enemies/razorfin.png";
            this.frameY = 0;
            this.lives = 6;
            this.score = 15;
            this.type = "razorfin";
            this.followSpeed = 0.09;
            this.amplitude = Math.random() * 11 + 4
            this.frequency = 0.01
        }


    }


    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 600;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.game.speed * this.speedModifier
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

        }
    }
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = new Image()
            this.image1.src = "./background/layer1.png"
            this.image2 = new Image()
            this.image2.src = "./background/layer2.png"
            this.image3 = new Image()
            this.image3.src = "./background/layer3.png"
            this.image4 = new Image()
            this.image4.src = "./background/layer4.png"
            this.layer1 = new Layer(this.game, this.image1, 0.5)
            this.layer2 = new Layer(this.game, this.image2, 0.8)
            this.layer3 = new Layer(this.game, this.image3, 1.2)
            this.layer4 = new Layer(this.game, this.image4, 2)
            this.layers = [this.layer2, this.layer3]
            this.alpha = 1
            this.dissapear = false

        }
        update(deltaTime) {

            if (this.game.score >= this.game.winningScore * 0.5) {
                if (this.alpha > 0) {
                    this.alpha -= 0.005;
                    if (this.alpha < 0) {
                        this.alpha = 0;
                        this.dissapear = true;
                    }
                }
            } else {
                this.alpha = 1;
                this.dissapear = false;
            }

            this.layer1.update();
            this.layers.forEach(layer => layer.update());
            this.layer4.update();
        }

        draw(context) {
            if ((this.game.score < this.game.winningScore * 0.6 || (this.gameOver && this.game.score < this.game.winningScore)) && this.game.player.lives > 0) {
                context.globalAlpha = this.alpha;
                this.layer1.draw(context);
                context.globalAlpha = 1;
            }

            this.layers.forEach(layer => layer.draw(context));
            this.layer4.draw(context);
        }




    }
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
                this.width,
                this.height
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

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = "Helvetica";
            this.color = "white"
            this.x = 20;
            this.y = 40
            this.lifeIconX = 0;
            this.lifeIconY = 0;

        }
        draw(context) {

            //score
            context.save()
            context.shadowOffsetX = 3;
            context.shadowOffsetY = 3;
            context.shadowColor = "black";
            context.fillStyle = this.color;
            context.font = `${this.fontSize}px ${this.fontFamily}`;
            context.fillText(`Score:  ${this.game.score}`, this.x, this.y)
            context.shadowBlur = 3;


            // timer
            const formattedTime = this.game.gameTime * 0.001
            const formattedTimeseconds = (formattedTime % 60).toFixed(1)
            if (formattedTime <= 60) {
                context.fillText(`Timer: ${formattedTimeseconds}`, 20, 100)
            } else {
                const formattedTimeminutes = Math.floor(formattedTime / 60)
                context.fillText(`Timer: ${formattedTimeminutes}:${formattedTimeseconds}`, 20, 100)

            }
            context.fillText(`Time limit ${(this.game.timeLimit * 0.00001).toFixed(2)} minutes`, this.game.width - 400, 80)
            context.fillText(`Winning Score ${this.game.winningScore} points`, this.game.width - 420, 110)


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
                context.font = `50px ${this.fontFamily}`;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
                context.font = `25px ${this.fontFamily}`;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40)
            }
            const ammoColor = this.game.player.powerUp ? "#ffffbd" : this.color;
            context.fillStyle = ammoColor;
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20)
            }
            context.restore()
            // Player's life level
            const livesIconWidth = 40;
            const livesIconHeight = 40;
            const livesSpacing = 10;

            for (let i = 0; i < this.game.player.lives; i++) {
                this.lifeIconX = context.canvas.width * 0.5 + (i + 1) * (livesIconWidth + livesSpacing);
                this.lifeIconY = 10;

                context.drawImage(
                    this.game.player.imgPlayer,
                    0, // First frame X position
                    0, // First frame Y position
                    this.game.player.width,
                    this.game.player.height,
                    this.lifeIconX,
                    this.lifeIconY,
                    livesIconWidth,
                    livesIconHeight)
            }

        }
        update(deltaTime) {
            this.lifeIconY += Math.sin(deltaTime) * 100000
        }
    }
    class Game {
        constructor(width, height) {
            this.debug = false;
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.sound = new SoundController()
            this.shield = new Shield(this);
            this.UI = new UI(this)
            this.keys = [];
            this.scoreAnimations = [];
            this.enemies = []
            this.particles = []
            this.confettis = []
            this.explosions = []
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 80;
            this.ammoInterval = 800;
            this.ammoTimer = 0;
            this.maxAmmo = 80;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 1000;
            this.gameTime = 0;
            this.timeLimit = 500000;
            this.speed = 1;
            this.elapsedTime = 0
            this.gameSound = true
        }

        update(deltaTime) {
            this.elapsedTime += deltaTime
            if (this.player.lives === 0 && this.score < this.winningScore) this.gameOver = true;
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update(deltaTime);
            this.UI.update(deltaTime)
            if (this.player.shield) this.shield.update(deltaTime)
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime
            }
            this.particles.forEach(particle => particle.update())
            this.particles = this.particles.filter(particle => !particle.markedForDeletion)
            this.explosions.forEach(explosion => explosion.update(deltaTime))
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion)
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (this.checkCollision(this.player, enemy)) {
                    if (this.gameSound) this.sound.explosion();
                    if (this.gameSound) this.sound.hit();
                    if (!this.player.shield) this.player.lives--
                    if (this.player.shield) {
                        this.shield.reset();
                        if (this.gameSound) this.sound.shield()
                    }
                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    for (let i = 0; i < enemy.lives; i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                    }
                    for (let i = 0; i < 12 - this.player.lives; i++) {
                        this.particles.push(new Particle(this, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5))
                    }

                    const scoreAnimation = new ScoreAnimation(
                        this.game,
                        this.player.x + this.player.width * 0.5,
                        this.player.y + this.player.height * 0.5,
                        enemy.score,
                        true
                    );
                    if (this.score != 0 && !this.gameOver) {
                        this.score -= enemy.lives
                        if (this.score < 0) this.score = 0
                        this.scoreAnimations.push(scoreAnimation);
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        for (let i = 0; i < 2; i++) {
                            this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                        }


                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            if (this.gameSound) this.sound.explosion();
                            const scoreAnimation = new ScoreAnimation(
                                this.game,
                                enemy.x + enemy.width * 0.5,
                                enemy.y + enemy.height * 0.5,
                                enemy.score,
                                false
                            );
                            this.scoreAnimations.push(scoreAnimation);

                            this.addExplosion(enemy);
                            if (enemy.type === "hivewhale") {
                                for (let i = 0; i < 3; i++) {
                                    this.enemies.push(new Drone(this, Math.random() * enemy.width * 0.6 + enemy.x, Math.random() * enemy.height * 0.5 + enemy.y))
                                }
                            }
                            for (let i = 0; i < enemy.lives; i++) {
                                this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                            }
                            if (!this.gameOver) this.score += enemy.score;
                            if (this.score > this.winningScore) this.gameOver = true;
                            if (enemy.type === "lucky" || enemy.type === "moonfish") this.player.enterPowerUp()
                            if (enemy.type === "bulbwhale" || enemy.type === "moonfish") {
                                this.player.shield = true
                                if (this.gameSound) this.sound.shield()
                                this.shield.reset()
                            }
                            if (enemy.type === "bulbwhale" && this.player.lives < 10) this.player.lives++

                        }
                    }
                })
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            if (this.score >= this.winningScore) {

                this.confettis.push(new Confetti(this));
            }

            this.confettis.forEach(confetti => {
                confetti.update(deltaTime);
            });

            this.confettis = this.confettis.filter(confetti => {
                return confetti.alpha > 0;
            });
            this.scoreAnimations.forEach(animation => {
                animation.update(deltaTime);
            });
            this.scoreAnimations = this.scoreAnimations.filter(animation => !animation.markedForDeletion);

        }
        draw(context) {
            this.background.draw(context)
            this.UI.draw(context)
            this.player.draw(context);
            if (this.player.shield) this.shield.draw(context);
            this.particles.forEach(particle => particle.draw(context));
            this.enemies.forEach(enemy => enemy.draw(context));
            this.explosions.forEach(explosion => explosion.draw(context));
            this.background.layer4.draw(context)
            game.scoreAnimations.forEach(animation => {
                animation.draw(context);
            });
            this.confettis.forEach(confetti => confetti.draw(ctx));
        }
        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.2) {
                this.enemies.push(new Angler1(this));
            } else if (randomize < 0.4) {
                this.enemies.push(new Angler2(this));
            } else if (!this.enemies.some(enemy => enemy instanceof Stalker) && randomize < 0.5 && this.score > this.winningScore * 0.58) {
                for (let i = 0; i < 3; i++) {
                    this.enemies.push(new Stalker(this));
                }
            } else if (!this.enemies.some(enemy => enemy instanceof Razorfin) && randomize < 0.6 && this.score > this.winningScore * 0.1) {
                this.enemies.push(new Razorfin(this));
            } else if (!this.enemies.some(enemy => enemy instanceof Hivewhale) && randomize < 0.7 && this.score > this.winningScore * 0.45) {
                this.enemies.push(new Hivewhale(this));
            } else if (!this.enemies.some(enemy => enemy instanceof Bulbwhale) && randomize < 0.8 && this.score > this.winningScore * 0.6) {
                this.enemies.push(new Bulbwhale(this));
            } else if (!this.enemies.some(enemy => enemy instanceof Moonfish) && randomize < 0.9 && this.score > this.winningScore * 0.6) {
                const randomize2 = Math.floor(Math.random() * 4 + 1)
                for (let i = 0; i < randomize2; i++) {
                    this.enemies.push(new Moonfish(this));
                }
            }

            if (!this.enemies>= 2 && this.enemies.some(enemy => enemy instanceof Lucky) && !this.player.powerUp && this.score > this.winningScore * 0.12 && this.elapsedTime >= 25000) {
                this.enemies.push(new Lucky(this));
                this.elapsedTime = 0;
            }

        }

        addExplosion(enemy) {
            const randomize = Math.random();
            if (randomize < 0.5) {
                this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
            } else {
                this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
            }
        }
        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height)


    let lastTime = 0
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate)
    }

    animate(0);




    ///Progress bar
    simulateGameLoad();

    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '10px';
    progressBar.style.backgroundColor = 'blue';
    progressBar.style.transition = 'width 0.5s ease';
    progressBar.style.margin = '0 auto';
    progressBar.style.position = 'absolute';
    progressBar.style.top = '50%';
    progressBar.style.left = '50%';
    progressBar.style.transform = 'translate(-50%, -50%)';

    const progressText = document.createElement('div');
    progressText.innerText = 'Loading...';
    progressText.style.textAlign = 'center';
    progressText.style.marginTop = '40px';
    progressText.style.position = 'absolute';
    progressText.style.top = '50%';
    progressText.style.left = '50%';
    progressText.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(progressBar);
    document.body.appendChild(progressText);

    function simulateGameLoad() {
        let progress = 0;
        const totalProgress = 100;
        const loadingTime = 5000; 

        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            progressBar.style.right = `${100 - progress}%`;
            progressText.innerText = `Loading... ${progress}%`;
            progressText.style.right = `${100 - progress}%`;

            if (progress >= totalProgress) {
                clearInterval(interval);
                startGame();
            }
        }, loadingTime / totalProgress);
    }

    function startGame() {
        // Your game start logic here

        progressBar.parentNode.removeChild(progressBar);
        progressText.parentNode.removeChild(progressText);
        document.body.appendChild(canvas);

    }



})


