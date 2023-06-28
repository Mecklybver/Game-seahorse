import { scale } from "../script2.js";


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
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width * scale, this.height * scale);
        context.drawImage(this.imgEnemy,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width * scale,
            this.height * scale)
        context.fillStyle = "black"
        context.font = "30px Helvetica"
        if (this.game.debug) context.fillText(this.lives, this.x, this.y)
        if (this.game.debug) context.fillText(this.type, this.x, this.y + this.height * scale)
        if (this.game.debug) context.fillText(this.frameY, this.x + this.width * scale, this.y + this.height * scale)

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
        this.speedX = Math.random() * -3 - 1.5
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
        this.frequency = Math.random() * 0.1 + 0.1

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
        this.speedX = Math.random() * -5 - 2;
        this.followSpeed = 0.05;
        this.amplitude = Math.random() * 13 + 5
        this.frequency = Math.random() * 0.1 * 0.1
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
        this.frequency = Math.random() * 0.02 + 0.01
        this.speedX = Math.random() * -2 - 1.5;

    }


}




export {
    Enemy,
    Angler1,
    Angler2,
    Lucky,
    Hivewhale,
    Drone,
    Bulbwhale,
    Moonfish,
    Stalker,
    Razorfin
  };
  