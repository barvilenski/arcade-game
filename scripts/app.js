const gemsNumber = document.querySelector('.gems-value');
const timerMinutes = document.querySelector('.timer .minutes');
const timerSeconds = document.querySelector('.timer .seconds');
const heartsArray = document.querySelectorAll('.fa-heart');
const instructionsScreen = document.querySelector('.game-instructions');
const resultsScreen = document.querySelector('.game-results');
const resultsTitleValue = document.querySelector('.results-title');
const resultsScore = document.querySelector('.results-score-value');
const resultsGems = document.querySelector('.results-gems-value');
const gameLevel = document.querySelector('.level-value');
const tileWidth = 101, tileHeight = 83;
const gameStates = { notStarted: 0, level1: 1, level2: 2, level3: 3, ended: 4 };
const deathSound = new Audio('sounds/explosion.mp3');
const collectKeySound = new Audio('sounds/collect-key.mp3');
const collectGemSound = new Audio('sounds/collect-gem.mp3');
const levelUpSound = new Audio('sounds/level-up.mp3');
const jingleWinSound = new Audio('sounds/jingle-win.mp3');
const jingleLoseSound = new Audio('sounds/jingle-lose.mp3');
let currentGameState = gameStates.notStarted;
let gameTimer, secondsCounter = 300;

class GameObject {
  constructor(sprite, xPosition = tileWidth * -1, yPosition = tileHeight * -1) {
    this.sprite = sprite;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
  }

  hide() {
    this.xPosition = tileWidth * -1;
    this.yPosition = tileHeight * -1;
  }

  isHidden() {
    return (this.xPosition === tileWidth * -1 && this.yPosition === tileHeight * -1);
  }

  respawn(xPosition, yPosition) {
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
    this.hasKey = false;
    this.gemsCounter = 0;
    this.lastMove = null;
  }

  handleInput(key) {
    this.lastMove = key;
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

  moveBack() {
    switch (this.lastMove) {
      case 'up':
        this.yPosition += tileHeight;
        break;
      case 'down':
        this.yPosition -= tileHeight;
        break;
      case 'left':
        this.xPosition += tileWidth;
        break;
      case 'right':
        this.xPosition -= tileWidth;
        break;
    }
  }

  takeGem() {
    collectGemSound.cloneNode().play();
    this.gemsCounter++;
    updateGemsCounter();
  }

  takeKey() {
    collectKeySound.play();
    this.sprite = 'images/char-boy-key.png';
    this.hasKey = true;
  }

  die() {
    deathSound.play();
    this.hide();

    this.hearts--;
    updateHeartsCounter();
    if (this.hearts === 0) {
      endGame();
    } else {
      const self = this;
      setTimeout(function() { self.respawn(); }, 1000);
    }
  }

  respawn() {
    super.respawn(tileWidth * 4, tileHeight * 6);
  }
}

class Friend extends GameObject {
  constructor() {
    super('images/char-cat-girl.png');
  }

  respawn() {
    super.respawn(tileWidth * 8, tileHeight * 0);
  }
}

class Enemy extends GameObject {
  constructor() {
    super('images/enemy-bug.png', tileWidth * -1, tileHeight * getRandomInt(1, 5));
    this.speed = getRandomInt(100, 400);
  }

  respawn() {
    this.speed = getRandomInt(100, 400);
    super.respawn(tileWidth * -1, tileHeight * getRandomInt(1, 5));
  }

  update(dt) {
    this.xPosition += this.speed * dt;
    if (this.xPosition > tileWidth * 9) {
      this.respawn();
    }
  }
}

class Key extends GameObject {
  constructor() {
    super('images/key.png');
  }

  respawn() {
    super.respawn(tileWidth * getRandomInt(0, 8), tileHeight * getRandomInt(1, 5));
  }
}

class Gem extends GameObject {
  constructor() {
    super('images/gem-blue.png');
  }

  respawn() {
    const gemColors = ['blue', 'green', 'orange'];
    this.sprite = `images/gem-${gemColors[getRandomInt(0,2)]}.png`;
    super.respawn(tileWidth * getRandomInt(0, 8), tileHeight * getRandomInt(1, 5));
  }
}

class Rock extends GameObject {
  constructor() {
    super('images/rock.png', tileWidth * getRandomInt(0, 8), tileHeight * getRandomInt(1, 5));
  }

  respawn() {
    super.respawn(tileWidth * getRandomInt(0, 8), tileHeight * getRandomInt(1, 5));
  }
}

class Blood extends GameObject {
  constructor(xPosition, yPosition) {
    super('images/blood-splatter.png', xPosition, yPosition);
  }
}

class LevelSpot extends GameObject {
  constructor() {
    super('images/level-spot.png');
  }
}


function startGame() {
  instructionsScreen.classList.add('game-instructions-disabled');
  levelSpot.xPosition = tileWidth * 8;
  levelSpot.yPosition = tileHeight * 0;
  key.respawn();
  gem.respawn();
  gameTimer = setInterval(updateTimer, 1000);
  for (let i = 0; i < 5; i++) {
    rocks.push(new Rock());
    enemies.push(new Enemy());
  }
  currentGameState = gameStates.level1;
}

function levelUp() {
  switch (currentGameState) {
    case gameStates.level3:
      currentGameState = gameStates.ended;
      endGame();
      break;
    case gameStates.level2:
      friend.respawn();
    case gameStates.level1:
      bloodSplatters = [];
      key.respawn();
      gem.respawn();
      rocks.forEach(function(rock) {
        rock.respawn();
      });
      rocks.push(new Rock());
      enemies.forEach(function(enemy) {
        enemy.respawn();
      });
      enemies.push(new Enemy());
      (currentGameState === gameStates.level1) ? currentGameState = gameStates.level2 : currentGameState = gameStates.level3 ;
      gameLevel.textContent = currentGameState;
      player.respawn();
      player.sprite = 'images/char-boy.png';
      player.hasKey = false;
      break;
  }
}

function endGame() {
  clearInterval(gameTimer);
  enemies.forEach(function(enemy) {
    enemy.speed = 0;
  });

  const score = calculateScore();
  const resultsTitle = generateResultsTitle(score);
  const jingleSound = getJingleSound();

  resultsTitleValue.textContent = resultsTitle;
  resultsScore.innerHTML = `${score}<i class="fas fa-coins"></i>`;
  resultsGems.innerHTML = `${player.gemsCounter}<i class="far fa-gem"></i>`;
  jingleSound.play();
  resultsScreen.classList.remove('game-results-disabled');

  currentGameState = gameStates.ended;
}

function restartGame() {
  window.location.reload(false);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(time) {
  return time > 9 ? time : '0' + time;
}

function updateTimer() {
  secondsCounter--;
  timerMinutes.textContent = formatTime(parseInt(secondsCounter / 60));
  timerSeconds.textContent = formatTime(secondsCounter % 60);

  if (secondsCounter === 0) {
    endGame();
  }
}

function updateGemsCounter() {
  gemsNumber.textContent = player.gemsCounter;
}

function updateHeartsCounter() {
  heartsArray[player.hearts].classList.remove('fas');
  heartsArray[player.hearts].classList.add('far');
}

function calculateScore() {
  let score = 0;

  score += (secondsCounter * 10);
  score += (player.hearts * 800);
  score += (player.gemsCounter * 200);

  return score;
}

function generateResultsTitle(score) {
  if (player.hearts === 0 || secondsCounter === 0) {
    return ('YOU LOST, MAYBE NEXT TIME!');
  }
  else if (score < 4000) {
    return ('NICE, BUT YOU CAN DO BETTER!');
  } else if (score < 6000) {
    return ('GOOD JOB!');
  } else {
    return ('GREAT, YOU ROCK!');
  }
}

function getJingleSound() {
  if (player.hearts > 0) {
    return jingleWinSound;
  } else {
    return jingleLoseSound;
  }
}


let player = new Player();
let friend = new Friend();
let key = new Key();
let gem = new Gem();
let levelSpot = new LevelSpot();
let rocks = [];
let enemies = [];
let bloodSplatters = [];

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
    case gameStates.level1:
    case gameStates.level2:
    case gameStates.level3:
      if (!player.isHidden()) {
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
