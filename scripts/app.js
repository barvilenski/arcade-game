const tileWidth = 101;
const tileHeight = 83;

class Player {
  constructor() {
    this.xPosition = tileWidth * 2;
    this.yPosition = tileHeight * 5;
    this.sprite = 'images/char-boy.png';
  }

  handleInput(key) {
    switch (key) {
      case 'up':
        this.yPosition -= (this.yPosition > 0) ? tileHeight : 0;
        break;
      case 'down':
        this.yPosition += (this.yPosition < tileHeight * 5) ? tileHeight : 0;
        break;
      case 'left':
        this.xPosition -= (this.xPosition > 0) ? tileWidth : 0;
        break;
      case 'right':
        this.xPosition += (this.xPosition < tileWidth * 4) ? tileWidth : 0;
        break;
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition);
  }
}

class Enemy {
  constructor() {
    this.xPosition = -tileWidth;
    this.yPosition = (Math.floor(Math.random() * 3) + 1 ) * tileHeight;
    this.speed = Math.floor(Math.random() * 301) + 100;
    this.sprite = 'images/enemy-bug.png';
  }

  update(dt) {
    this.xPosition += this.speed * dt;
    if (this.xPosition > tileWidth * 5) {
      this.xPosition = -tileWidth;
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition);
  }
}

document.addEventListener('keyup', function(e) {
  const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

let player = new Player();
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
