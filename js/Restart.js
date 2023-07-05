class Restart {
    constructor(game) {
      this.game = game;
      this.restartButton = document.createElement("button");
      this.restartButton.addEventListener("click", () => this.restartGame());
    }
  
    restartGame() {
      // Reset game state
      this.game.earthquake = false;
      this.game.earthquakeTime = 0;
      this.game.debug = false;
      this.game.gameOver = false;
      this.game.score = 0;
      this.game.player.lives = 10;
      this.game.ammo = 80;
      this.game.ammoTimer = 0;
      this.game.enemyTimer = 0;
      this.game.gameTime = 0;
      this.game.elapsedTime = 0;
      this.game.backgroundMusicStarted = false;
      this.game.projectiles = [];
      this.game.projectilesFromEnemy = [];
      this.game.enemies = [];
      this.game.particles = [];
      this.game.explosions = [];
      this.game.scoreAnimations = [];
      this.game.confettis = [];
  
      requestAnimationFrame(() => this.gameLoop());
    }
  
    gameLoop() {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.game.previousTime) / 1000;
      this.game.update(deltaTime);
      this.game.draw(context);
      this.game.previousTime = currentTime;
  
      if (!this.game.gameOver) {
        requestAnimationFrame(() => this.gameLoop());
      }
    }
  }
  