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

export {
    Layer,
    Background
}