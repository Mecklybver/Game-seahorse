
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// canvas.width = 1220;
// canvas.height = 520;

import { UI } from "./js/UI.js";
import { Player } from "./js/player.js";
import { ScoreAnimation } from "./js/ScoreAnimation.js"
import { Confetti } from "./js/Confetti.js";
import { InputHandler } from "./js/InputHandler.js";
import { SoundController } from "./js/SoundController.js";
import { Shield } from "./js/Shield.js";
import { Particle } from "./js/Particle.js";
import { Angler1, Angler2, Lucky, Hivewhale, Drone, Bulbwhale, Moonfish, Stalker, Razorfin } from "./js/Enemies.js"
import { Background } from "./js/Background.js";
import { SmokeExplosion, FireExplosion } from "./js/explosion.js";
import { Blood } from "./js/Blood.js";
import { pause } from "./js/InputHandler.js";
import { Live } from "./js/Lives.js";


export const scale = window.devicePixelRatio

canvas.width = Math.floor(1220 * scale);
canvas.height = Math.floor(520 * scale);




class Game {
    constructor(width, height) {
        this.earthquake = false
        this.earthquakeTime = 0
        this.debug = false;
        this.width = width;
        this.height = height;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.sound = new SoundController()
        this.shield = new Shield(this);
        this.blood = new Blood(this)
        this.UI = new UI(this)
        this.keys = new Set()
        this.scoreAnimations = [];
        this.enemies = [];
        this.particles = [];
        this.confettis = [];
        this.explosions = [];
        this.projectiles = [];
        this.projectilesFromEnemy = [];
        this.lives = [];
        this.enemyTimer = 0;
        this.ammo = 80;
        this.ammoInterval = 800;
        this.ammoTimer = 0;
        this.maxAmmo = 80;
        this.gameOver = false;
        this.score = 0;
        this.winningScore = 1000;
        this.enemyInterval = 1000
        this.gameTime = 0;
        this.timeLimit = 500000;
        this.speed = 1;
        this.elapsedTime = 0
        this.gameSound = true
        this.backgroundMusicStarted = false;




    }

    update(deltaTime) {

        if (this.earthquake) this.earthquakeTime += deltaTime
        this.enemyInterval = Math.random() * (1400 - this.score) + 600;
        this.elapsedTime += deltaTime
        if (this.gameSound && !this.sound.isBackgroundMusicPlaying()) {
            if (!this.backgroundMusicStarted) {
                this.sound.playBackgroundMusic();
                this.backgroundMusicStarted = true;
            }
        } else if (!this.gameSound && this.sound.isBackgroundMusicPlaying()) {
            this.sound.stopBackgroundMusic();
            this.backgroundMusicStarted = false;
        }

        if (this.player.lives <= 0 && this.score < this.winningScore || this.gameTime > this.timeLimit) {
            this.gameOver = true;
            this.blood.update(deltaTime)
        }

        if (!this.gameOver) this.gameTime += deltaTime;
        this.background.update(deltaTime);
        if (this.player.shield) this.shield.update(deltaTime)
        this.player.update(deltaTime);
        this.UI.update(deltaTime);
        this.lives.forEach(life => {
            life.update(deltaTime)
            if (this.checkCollision(life, this.player)) {
                if(this.player.lives != 10 || this.player.lives === 0)this.player.lives++
                this.lives.splice(this.lives.indexOf(life), 1)
            }

        })

        if (this.ammoTimer > this.ammoInterval) {
            if (this.ammo < this.maxAmmo) this.ammo++
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime
        }
        this.particles.forEach(particle => particle.update())
        this.projectilesFromEnemy.forEach(projectile => projectile.update(deltaTime));




        this.particles = this.particles.filter(particle => !particle.markedForDeletion)
        this.explosions.forEach(explosion => explosion.update(deltaTime))
        this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion)
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        this.projectilesFromEnemy = this.projectilesFromEnemy.filter(projectile => !projectile.markedForDeletion);
        this.lives = this.lives.filter(life => !life.markedForDeletion);
        console.log(this.lives)





        this.projectilesFromEnemy.forEach(projectile => {
            if (this.checkCollision(projectile, this.player)) {
                for (let i = 0; i < 12 - this.player.lives; i++) {
                    this.particles.push(new Particle(this, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5))
                }
                game.earthquake = true
                if (this.gameSound) this.sound.explosion();
                if (this.gameSound) this.sound.hit();
                if (!this.player.shield) this.player.lives--
                if (this.player.shield) {
                    this.shield.reset();
                    if (this.gameSound) this.sound.shield()
                }
                projectile.markedForDeletion = true;

                for (let i = 0; i < 12 - this.player.lives; i++) {
                    this.particles.push(new Particle(this, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5))
                }

                const scoreAnimation = new ScoreAnimation(
                    this.game,
                    this.player.x + this.player.width * 0.5,
                    this.player.y + this.player.height * 0.5,
                    1,
                    true
                );
                if (this.score != 0 && !this.gameOver) {
                    this.score -= 1
                    if (this.score < 0) this.score = 0
                    this.scoreAnimations.push(scoreAnimation);
                }
            }
        })



        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            if (this.checkCollision(this.player, enemy)) {
                game.earthquake = true
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


            this.projectiles.forEach(projectile => {
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

                        if (this.score > 100 && this.score % 100 <= 3 || this.score > this.winningScore * 0.5 && this.score % 20 <= 4) {
                            console.log(this.lives)
                            this.lives.push(new Live(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                        }



                        if (this.score > this.winningScore) this.gameOver = true;
                        let randomize = Math.random()


                        if (enemy.type === "lucky" && randomize < 0.5 ) this.player.enterPowerUp()
                        if (enemy.type === "lucky" && randomize >= 0.5) {
                            if (this.gameSound) this.sound.shield()
                            this.player.shield = true
                            this.ammo = this.maxAmmo
                        }
                        if (enemy.type === "moonfish") this.player.enterPowerUp()
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
            if (confetti.alpha === 0 || confetti.y > canvas.height + 10 || confetti.x < -5 || confetti.x > canvas.width + 10) {
                confetti.markedForDeletion = true;
            }

        });

        this.confettis = this.confettis.filter(confetti => !confetti.markedForDeletion);
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
        this.blood.draw(context)
        this.lives.forEach(live => live.draw(context));
        this.background.layer4.draw(context)
        game.scoreAnimations.forEach(animation => {
            animation.draw(context);
        });
        this.confettis.forEach(confetti => confetti.draw(context));
        this.projectilesFromEnemy.forEach(projectile => projectile.draw(context));
    }
    addEnemy() {
        const randomize = Math.random();
        if (randomize < 0.2 && this.score < this.winningScore * 0.54) {
            this.enemies.push(new Angler1(this));
        } else if (randomize < 0.4 && this.score < this.winningScore * 0.54) {
            this.enemies.push(new Angler2(this));
        } else if (!this.enemies.some(enemy => enemy instanceof Stalker) && randomize < 0.5 && this.score > this.winningScore * 0.56) {
            const randomize3 = Math.floor(Math.random() * 5 + 3)
            for (let i = 0; i < randomize3; i++) {
                this.enemies.push(new Stalker(this));
            }
        } else if (!this.enemies.some(enemy => enemy instanceof Razorfin) && randomize < 0.6 && this.score > this.winningScore * 0.1) {
            this.enemies.push(new Razorfin(this));
        } else if (!this.enemies.some(enemy => enemy instanceof Hivewhale) && randomize < 0.7 && this.score > this.winningScore * 0.45) {
            this.enemies.push(new Hivewhale(this));
        } else if (!this.enemies.some(enemy => enemy instanceof Bulbwhale) && randomize < 0.8 && this.score > this.winningScore * 0.53) {
            this.enemies.push(new Bulbwhale(this));
        } else if (!this.enemies.some(enemy => enemy instanceof Moonfish) && randomize < 0.9 && this.score > this.winningScore * 0.55) {
            const randomize2 = Math.floor(Math.random() * 4 + 1)
            for (let i = 0; i < randomize2; i++) {
                this.enemies.push(new Moonfish(this));
            }
        }

        if ((!this.enemies.some(enemy => enemy instanceof Lucky) && !this.player.powerUp && this.score > this.winningScore * 0.53 && this.elapsedTime >= 20000) || (!this.enemies.some(enemy => enemy instanceof Lucky) && !this.player.powerUp && this.score > this.winningScore * 0.1 && this.elapsedTime >= 30000 && this.enemies.length >= 2) || this.enemies.lenght === 6 && this.elapsedTime >= 30000) {
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
            rect1.x < rect2.x + rect2.width * scale &&
            rect1.x + rect1.width * scale > rect2.x &&
            rect1.y < rect2.y + rect2.height * scale &&
            rect1.y + rect1.height * scale > rect2.y
        );
    }
}

const game = new Game(canvas.width, canvas.height)


const intensity = 15; // Adjust as needed
let duration = 800; // Adjust as needed
let startTime = 0;
export function animate(timeStamp) {
    const deltaTime = timeStamp - startTime;
    startTime = timeStamp;
    if (!pause) {
        if (game.earthquake && !game.player.shield) {
            if (game.earthquakeTime < duration) {
                const offsetX = Math.random() * intensity * 2 - intensity;
                const offsetY = Math.random() * intensity * 2 - intensity;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.translate(offsetX, offsetY);
                game.draw(ctx);
                game.update(deltaTime);
                ctx.restore();
                requestAnimationFrame(animate);
            } else {
                game.earthquake = false;
                game.earthquakeTime = 0
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                game.draw(ctx);
                game.update(deltaTime);
                requestAnimationFrame(animate);
            }
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.draw(ctx);
            game.update(deltaTime);
            requestAnimationFrame(animate);
        }
    } else {
        ctx.save()
        ctx.fillStyle = "white"
        ctx.font = "170px Helvetica"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("PAUSE", game.width * 0.5, game.height * 0.5)
        ctx.restore()
    }
}

window.addEventListener("load", e => {



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
        const button = document.createElement("button")
        document.body.appendChild(button)
        button.textContent = "Start"
        progressBar.parentNode.removeChild(progressBar);
        progressText.parentNode.removeChild(progressText);
        document.body.appendChild(button)
        button.addEventListener("click", e => {
            document.body.removeChild(button)
            document.body.appendChild(canvas);
            animate(0);



        })

    }

})


