
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
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
            this.elapseTime = 0;
            this.takePoints = takePoints
            this.amplitude = 20
           
        }

        update(deltaTime) {
            this.elapseTime += deltaTime;
        
            const targetX = 70;
            const targetY = 30;
            
            const distance = Math.hypot(targetX - this.x, targetY - this.y);
            
            
            if (distance > 1) { 
                const moveX = (targetX - this.x) * this.speed;
                const moveY = (targetY - this.y) * this.speed;
                this.x += moveX + Math.cos(0.01 * this.elapseTime) * this.amplitude;
                this.y += moveY + Math.sin (0.01 * this.elapseTime) * this.amplitude
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
            this.radius = Math.random ()* 8 + 2;
            this.colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 3 + 1;
            this.rotation = Math.random() * 4;
            this.maxGrowth = 0.5
            this.minGrowth = 0.01
            this.growth = Math.random () * this.maxGrowth    +  this.minGrowth
            this.alpha = 1;
            this.fall = Math.random() * 0.1 + 0.002


            this.x = Math.random() * this.game.width;
            this.y = Math.random() * this.game.height * 0.3;
        }

        update(deltaTime) {

            this.x += Math.cos(this.angle + deltaTime) * this.speed ;
            this.y +=(this.fall *deltaTime) +  Math.sin(this.angle + deltaTime) * this.speed ;
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


    class InputHadler {
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
                    this.game.powerUp = this.game.player.enterPowerUp()
                    this.game.player.powerUpLimit = Infinity
                }

            });
            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }

            });

        }
    }
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
            this.image = new Image();
            this.image.src = "./player/projectile.png"
        }
        update(deltaTime) {

            this.x += this.speed;
            if (this.x > this.game.width * 0.97) this.markedForDeletion = true;
        }
        draw(context) {

            context.fillStyle = "yellow"
            context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x - this.image.width * 0.5, this.y - this.image.height * 0.5)
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
            this.maxFrame = 37
            this.speedY = 0;
            this.speedX = 0
            this.maxSpeed = 2;
            this.projectiles = []
            this.imgPlayer = new Image();
            this.imgPlayer.src = "./player/player.png"
            this.powerUp = false
            this.powerUpTimer = 0;
            this.powerUpLimit = 12000;
            this.elapsedTime = 0;
            this.shootDelay = 150;
            this.lastShoot = 0
        }
        update(deltaTime) {
            this.lastShoot += deltaTime

            if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes("ArrowDown")) this.speedY = this.maxSpeed;
            else this.speedY = 0
            this.elapsedTime += deltaTime;
            this.y += (this.speedY * deltaTime) * 0.1 + Math.sin(0.01 * this.elapsedTime)

            if (this.game.keys.includes("ArrowLeft")) this.speedX = -this.maxSpeed;
            else if (this.game.keys.includes("ArrowRight")) this.speedX = this.maxSpeed;
            else this.speedX = 0
            if (this.game.keys.includes(" ")) this.shootTop()
            this.x += (this.speedX * deltaTime) * 0.1



            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            this.projectiles = this.projectiles.filter(projectile => {
                return !projectile.markedForDeletion
            })
            //frame animation
            this.frameX++
            this.frameX %= this.maxFrame
            // power
            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                    this.shootDelay = 50;
                }
                else {
                    this.powerUpTimer += deltaTime
                    this.frameY = 1;
                    if (this.game.ammo != this.game.maxAmmo) this.game.ammo += 0.0095;
                    if (this.game.ammo > this.game.maxAmmo) this.game.ammo = this.game.maxAmmo
                }
            }
        }
        draw(context) {
            context.save()
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height)
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            })
            context.drawImage
                (this.imgPlayer,
                    this.frameX * this.width,
                    this.frameY * this.height,
                    this.width,
                    this.height,
                    this.x,
                    this.y,
                    this.width,
                    this.height)

            context.restore()
        }

        shootTop() {
            if (this.game.ammo > 0 && this.lastShoot > this.shootDelay) {
                this.lastShoot = 0;
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
            this.shootDelay = 120
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
            this.elapseTime = 0

        }

        update(deltaTime) {
            this.elapseTime += deltaTime
            this.elapsetime %= 60
            // if (this instanceof Lucky && this.elapsedTime > 10) {
            //     this.game.enemies.push(new Lucky(this.game));
            //     this.elapsedTime = 0;
            //   }
            this.x += this.speedX - this.game.speed;
            this.speedY = Math.sin((this.game.speed + this.x) * 0.1);
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
            context.font = "20px Helvetica"
            if (this.game.debug) context.fillText(this.lives, this.x, this.y)
            if (this.game.debug) context.fillText(this.type, this.x, this.y + this.height)

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
            this.speedX = Math.random() * -4.2 - 0.5;
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

        }
        update() {
            this.layer1.update()
            this.layers.forEach(layer => layer.update())
            this.layer4.update()
        }
        draw(context) {
            if (this.game.score < 500) this.layer1.draw(context)
            this.layers.forEach(layer => layer.draw(context))
            this.layer4.draw(context)

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

            //gameOver message
            if (this.game.gameOver) {
                context.textAlign = "center";
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore) {
                    message1 = "You Win!";
                    message2 = "Well done!!"
                } else {
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

        }
    }
    class Game {
        constructor(width, height) {
            this.debug = false;
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHadler(this);
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
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.background.update();
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
                    enemy.markedForDeletion = true;
                    this.addExplosion(enemy);
                    for (let i = 0; i < enemy.lives; i++) {
                        this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                    }
                    // if (enemy.type === "lucky") this.player.enterPowerUp()
                    /*else */ if (this.score != 0 && !this.gameOver) this.score -= enemy.lives
                    const scoreAnimation = new ScoreAnimation(
                        this.game,
                        this.player.x + this.player.width * 0.5,
                        this.player.y + this.player.height * 0.5,
                        enemy.score,
                        true
                    );
                    if (this.score != 0 && !this.gameOver) {
                        this.score -= enemy.lives
                        this.scoreAnimations.push(scoreAnimation);
                    }
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        for (let i = 0; i < 2; i++) {
                            this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                        }


                        console.log(this.scoreAnimations)
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;

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
                            if (enemy.type === "lucky") this.player.enterPowerUp()

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
            if (randomize < 0.3) {
                this.enemies.push(new Angler1(this));
            } else if (randomize < 0.6) {
                this.enemies.push(new Angler2(this));
            } else if (!this.enemies.some(enemy => enemy instanceof Hivewhale) && randomize < 0.9 && this.score > this.winningScore * 0.3) {
                this.enemies.push(new Hivewhale(this));
            }
            else if (!this.enemies.some(enemy => enemy instanceof Lucky) && !this.player.powerUp && this.score > this.winningScore * 0.1) {
                this.enemies.push(new Lucky(this))
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





})


