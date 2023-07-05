import { scale } from "../script2.js";

export class Live {
  constructor(game, x, y) {
    this.game = game;
    this.width = 120
    this.height = 190
    this.x = x;
    this.y = y;
    this.image = this.game.player.imgPlayer;
    this.frameX = 0;
    this.maxFrame = 37;
    this.IconSize = 50
    this.elapsedTime = 0;
    this.directionX = Math.random() * 12 - 6;
    this.directionY = Math.random() * 12 - 6;
    this.directionUpdated = false;

  }

  draw(context) {
    context.save();
    context.fillStyle = "red";
    context.beginPath();
    if(this.game.debug)context.arc(this.x - this.width - this.IconSize, this.y, 5, 0, 2 * Math.PI);
    context.closePath();
    // context.();
    context.scale(-1, 1);

    context.fill();
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      - this.x ,
      this.y,
      this.IconSize * scale,
      this.IconSize * scale
    );
    context.restore();
  }



  update(deltaTime) {

    this.elapsedTime += deltaTime;
    this.frameX++;
    this.frameX %= this.maxFrame;
    this.y+= 2;

    if (this.y > this.game.height || this.x > this.game.width || this.x + this.IconSize < 0 || this.y + this.IconSize < 0) {
      this.markedForDeletion = true;
    }

    
    
   
    let randomize = Math.random() * 400   + 450;

    if (this.elapsedTime > 1000 && this.elapsedTime % 1000 <= randomize) {
      this.x += this.directionX;
      this.y += this.directionY;
      this.directionUpdated = false; 
    } else if (!this.directionUpdated) {
      this.directionX = Math.random() * 12 - 6;
      this.directionY = Math.random() * 12 - 6;
      this.directionUpdated = true; 
    }
  }
}