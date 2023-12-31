export let pause = false
import { animate } from "../script2.js";

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.resetTimer = 0
        window.addEventListener("keydown", e => {
            if ((e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === " ")
                && !this.game.keys.has(e.key)) {
                this.game.keys.add(e.key);
            } else if (e.key === "F2") {
                this.game.debug = !this.game.debug
            } else if (e.key === "p") {
                this.game.player.powerUp =!this.game.player.powerUp
            } else if (e.key === "w") {
                pause = !pause
                    cancelAnimationFrame(animate)
                if (!pause) {
                    animate(0);
                  }                
            } else if (e.key === "p") {
                this.game.player.powerUp = !this.game.player.powerUp
                if(this.game.player.powerUp)this.game.sound.powerUp()
                if(!this.game.player.powerUp)this.game.sound.powerDown()
                this.game.player.powerUpLimit = Infinity
                if(!this.game.player.powerUp)this.game.sound.powerDown()
                if(!this.game.player.powerUp)this.game.player.PowerUp = 0

            } else if (e.key === "q") {
                this.game.gameSound = !this.game.gameSound;
            } else if (e.key === "s") {
                this.game.player.shield = !this.game.player.shield
                if (this.game.gameSound) this.game.sound.shield()
                this.game.shield.reset()
            }

        });
        window.addEventListener("keyup", e => {
            if (this.game.keys.has(e.key)) {
                this.game.keys.delete(e.key)
            }

        });

    }
}