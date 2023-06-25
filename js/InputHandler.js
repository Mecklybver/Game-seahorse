
export class InputHandler {
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