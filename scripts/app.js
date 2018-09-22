const gemsNumber = document.querySelector('.gems-value');
const timerMinutes = document.querySelector('.timer .minutes');
const timerSeconds = document.querySelector('.timer .seconds');
const heartsArray = document.querySelectorAll('.fa-heart');
const instructionsScreen = document.querySelector('.game-instructions');
const resultsScreen = document.querySelector('.game-results');
const tileWidth = 101, tileHeight = 83;
const gameStates = { notStarted: 0, started: 1, ended: 2 };
let currentGameState = gameStates.notStarted;
let gameTimer, secondsCounter = 120;

class GameObject {
  constructor(sprite, xPosition, yPosition) {
    this.sprite = sprite;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }

  render(xOffset = 0, yOffset = 0, spriteWidth = 101, spriteHeight = 171) {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition + xOffset, this.yPosition + yOffset, spriteWidth, spriteHeight);
  }
}

class Player extends GameObject {
  constructor() {
    super('images/char-boy.png', tileWidth * 4, tileHeight * 6);
    this.hearts = 3;
    this.gemsCounter = 0;
    this.enabled = true;
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

    if (this.hearts === 0) {
      endGame();
    } else {
      const self = this;
      setTimeout(function () {
        self.xPosition = tileWidth * 4;
        self.yPosition = tileHeight * 6;
        self.enabled = true;
      }, 1000);
    }
  }
}

class Enemy extends GameObject {
  constructor() {
    super('images/enemy-bug.png', tileWidth * -1, tileHeight * -1);
    this.speed = 0;
  }

  randomizeProperties() {
    this.xPosition = tileWidth * -1;
    this.yPosition = tileHeight * getRandomInt(1, 5);
    this.speed = getRandomInt(100, 400);
  }

  update(dt) {
    this.xPosition += this.speed * dt;
    if (this.xPosition > tileWidth * 9) {
      this.randomizeProperties();
    }
  }
}

class Gem extends GameObject {
  constructor() {
    super('images/gem-blue.png', tileWidth * 4, tileHeight * 3);
  }

  respawn() {
    const gemColors = ['blue', 'green', 'orange'];
    this.sprite = `images/gem-${gemColors[getRandomInt(0,2)]}.png`;
    this.xPosition = tileWidth * getRandomInt(0, 8);
    this.yPosition = tileHeight * getRandomInt(1, 5);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setTime() {
  secondsCounter--;
  timerMinutes.textContent = padTime(parseInt(secondsCounter / 60));
  timerSeconds.textContent = padTime(secondsCounter % 60);

  if (secondsCounter === 0) {
    endGame();
  }
}

function padTime(time) {
  return time > 9 ? time : '0' + time;
}

function startGame() {
  instructionsScreen.classList.add('game-instructions-disabled');
  gameTimer = setInterval(setTime, 1000);
  for (enemy of allEnemies) {
    enemy.randomizeProperties();
  }
  currentGameState = gameStates.started;
}

function endGame() {
  clearInterval(gameTimer);
  player.enabled = false;
  for (enemy of allEnemies) {
    enemy.speed = 0;
  }
  resultsScreen.classList.remove('game-results-disabled');
  currentGameState = gameStates.ended;
}

function restartGame() {
  window.location.reload(false);
}

let gem = new Gem();
let player = new Player();
let allEnemies = [];
for (let i = 0; i < 6; i++) {
  allEnemies.push(new Enemy());
}

document.addEventListener('keyup', function(e) {
  const allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
  };

  switch (currentGameState) {
    case gameStates.notStarted:
      if (allowedKeys[e.keyCode] === 'enter') {
        startGame();
      }
      break;
    case gameStates.started:
      if (player.enabled) {
        player.handleInput(allowedKeys[e.keyCode]);
      }
      break;
    case gameStates.ended:
      if (allowedKeys[e.keyCode] === 'enter') {
        restartGame();
      }
      break;
  }
});
