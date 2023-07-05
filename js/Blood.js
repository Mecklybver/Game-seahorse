export class Blood{
    constructor(game){
        this.game = game
        this.x = 0;
        this.y = 0;
        this.width = this.game.width;
        this.height = this.game.height;
        this.image = new Image()
        this.image.src = "./background/blood.png"
        this.elapsedTime = 0
    }

    draw(context){
        context.save()
        context.globalAlpha = 0.6
        context.drawImage(this.image,this.x,this.y-this.image.height - 10,this.width,this.height)
        context.restore()
    }
    update(deltaTime){
        this.elapsedTime += deltaTime
        this.y += 2
        if(this.y >= this.image.height) this.y = this.image.height
    }

}