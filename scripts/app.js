const tileWidth = 101;
const tileHeight = 83;
const numRows = 7;
const numColumns = 9;

class Player {
  constructor() {
    this.enabled = true;
    this.xPosition = tileWidth * 4;
    this.yPosition = tileHeight * 6;
    this.sprite = 'images/char-boy.png';
  }

  handleInput(key) {
    switch (key) {
      case 'up':
        this.yPosition -= (this.yPosition > 0) ? tileHeight : 0;
        break;
      case 'down':
        this.yPosition += (this.yPosition < tileHeight * 6) ? tileHeight : 0;
        break;
      case 'left':
        this.xPosition -= (this.xPosition > 0) ? tileWidth : 0;
        break;
      case 'right':
        this.xPosition += (this.xPosition < tileWidth * 8) ? tileWidth : 0;
        break;
    }
  }

  die() {
    this.enabled = false;
    this.xPosition = tileWidth * 4;
    this.yPosition = tileHeight * 8;

    const self = this;
    setTimeout(function () {
      self.xPosition = tileWidth * 4;
      self.yPosition = tileHeight * 6;
      self.enabled = true;
    }, 1000);
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition - 12);
  }
}

class Enemy {
  constructor() {
    this.xPosition = -tileWidth;
    this.yPosition = (Math.floor(Math.random() * 5) + 1 ) * tileHeight;
    this.speed = Math.floor(Math.random() * 301) + 100;
    this.sprite = 'images/enemy-bug.png';
  }

  update(dt) {
    this.xPosition += this.speed * dt;
    if (this.xPosition > tileWidth * 9) {
      this.xPosition = -tileWidth;
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition - 22);
  }
}

document.addEventListener('keyup', function(e) {
  const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
  };

  if (player.enabled) {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

let player = new Player();
let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
