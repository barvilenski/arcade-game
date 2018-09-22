const gemsNumber = document.querySelector('.gems-value');
const timerMinutes = document.querySelector('.minutes');
const timerSeconds = document.querySelector('.seconds');
const heartsArray = document.querySelectorAll('.fa-heart');
const instructionsScreen = document.querySelector('.game-instructions');
const tileWidth = 101;
const tileHeight = 83;
let gameTimer, secondsCounter = 0;
let gameStarted = false;

class Player {
  constructor() {
    this.enabled = true;
    this.gemsCounter = 0;
    this.hearts = 3;
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

  takeGem() {
    this.gemsCounter++;
    gemsNumber.textContent = this.gemsCounter;
  }

  die() {
    this.enabled = false;
    this.xPosition = tileWidth * 4;
    this.yPosition = tileHeight * 8;

    if (this.hearts > 0) {
      this.hearts--;
      heartsArray[this.hearts].classList.remove('fas');
      heartsArray[this.hearts].classList.add('far');
    }

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
    this.xPosition = tileWidth * -1;
    this.yPosition = tileHeight * -1;
    this.speed = 0;
    this.sprite = 'images/enemy-bug.png';
  }

  randomizeProperties() {
    this.xPosition = tileWidth * -1;
    this.yPosition = tileHeight * (Math.floor(Math.random() * 5) + 1);
    this.speed = Math.floor(Math.random() * 301) + 100;
  }

  update(dt) {
    this.xPosition += this.speed * dt;
    if (this.xPosition > tileWidth * 9) {
      this.randomizeProperties();
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition - 22);
  }
}

class Gem {
  constructor() {
    this.xPosition = tileWidth * 4;
    this.yPosition = tileHeight * 3;
    this.sprite = 'images/gem-blue.png';
  }

  respawn() {
    this.xPosition = tileWidth * Math.floor(Math.random() * 9);
    this.yPosition = tileHeight * (Math.floor(Math.random() * 5) + 1);
    this.sprite = 'images/gem-blue.png';
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition + 17, this.yPosition + 18, 68, 110);
  }
}

function setTime() {
  secondsCounter++;
  timerMinutes.textContent = padTime(parseInt(secondsCounter / 60));
  timerSeconds.textContent = padTime(secondsCounter % 60);
}

function padTime(time) {
  return time > 9 ? time : '0' + time;
}

function initGame() {
  instructionsScreen.classList.add('game-instructions-disabled');
  for (enemy of allEnemies) {
    enemy.randomizeProperties();
  }
  gameTimer = setInterval(setTime, 1000);
}

let gem = new Gem();
let allEnemies = [new Enemy(), new Enemy()];
let player = new Player();

document.addEventListener('keyup', function(e) {
  const allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
  };

  if (!gameStarted && allowedKeys[e.keyCode] === 'enter') {
    initGame();
    gameStarted = true;
  }

  if (gameStarted) {
    if (player.enabled) {
      player.handleInput(allowedKeys[e.keyCode]);
    }
  }
});
