/* Engine.js
 * This file provides the game loop functionality (update and render entities).
 * It draws the initial game board on the screen and then calls the update and
 * render methods on the game objects (defined in app.js).
 */

var Engine = (function(global) {
  var doc = global.document,
      win = global.window,
      gameContainer = document.querySelector('.game-container'),
      canvas = doc.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      lastTime;

  canvas.width = 909;
  canvas.height = 707;
  gameContainer.appendChild(canvas);  // Add the canvas to the DOM.

  /* This function serves as the kickoff point for the game loop.
   * It handles calling the update and render methods.
   */
  function main() {
    // Get the time delta information which is required for smooth animation.
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    win.requestAnimationFrame(main);
  }

  // This function does some initial setup that should only occur only once.
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  // This function calls all of the functions which may need to update entity's data.
  function update(dt) {
    updateEntities(dt);
    checkCollisions();
  }

  // This function loops through the game objects and updates their data.
  function updateEntities(dt) {
    enemies.forEach(function(enemy) {
      enemy.update(dt);
    });
  }

  /* This function checks if there is any collision between game objects.
   * If so, it updates the game objects' data accordingly.
   */
  function checkCollisions() {
    rocks.forEach(function(rock) {
      if (rock.yPosition === player.yPosition && rock.xPosition === player.xPosition) {
        player.moveBack();
      }
      if (rock.yPosition === gem.yPosition && rock.xPosition === gem.xPosition) {
        gem.respawn();
      }
      if (rock.yPosition === key.yPosition && rock.xPosition === key.xPosition) {
        key.respawn();
      }
    });

    enemies.forEach(function(enemy) {
      if (enemy.yPosition === player.yPosition && Math.abs(enemy.xPosition - player.xPosition) <= 80) {
        bloodSplatters.push(new Blood(player.xPosition, player.yPosition));
        player.die();
      }
    });

    if (gem.yPosition === player.yPosition && gem.xPosition === player.xPosition) {
      player.takeGem();
      gem.respawn();
    }

    if (!key.isHidden() && key.yPosition === player.yPosition && key.xPosition === player.xPosition) {
      player.takeKey();
      key.hide();
    }

    if (player.hasKey && levelSpot.yPosition === player.yPosition && levelSpot.xPosition === player.xPosition) {
      player.hide();
      if (currentGameState === 3) { friend.hide(); }
      levelUpSound.play();
      setTimeout(levelUp, 1000);
    }
  }

  // This function initially draws the "game level", and then draws the game objects.
  function render() {
    // This array holds the relative URL to the image used for each game level row.
    var rowImages = [
          'images/block-grass.png',  // Row 1 is grass
          'images/block-stone.png',  // Row 2 is stone
          'images/block-stone.png',  // Row 3 is stone
          'images/block-stone.png',  // Row 4 is stone
          'images/block-stone.png',  // Row 5 is stone
          'images/block-stone.png',  // Row 6 is stone
          'images/block-grass.png'   // Row 7 is grass
        ],
        numRows = 7,
        numCols = 9,
        row, col;

    // Clear the existing canvas, then draw each portion of the "game level grid" one after another.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  // This function goes through the game objects and draws them on the canvas.
  function renderEntities() {
    levelSpot.render(0, -39);
    bloodSplatters.forEach(function(blood) {
      blood.render(0, -38);
    });
    rocks.forEach(function(rock) {
      rock.render(10, -10, 91, 154);
    });
    gem.render(17, 18, 68, 110);
    key.render(10, 10, 81, 137);
    friend.render(0, -12);
    player.render(0, -12);
    enemies.forEach(function(enemy) {
      enemy.render(0, -22);
    });
  }

  /* This function does nothing. It is a good place to handle game reset states
   * (a new game menu, a game over screen, etc...). It's called once by the init() method.
   */
  function reset() {
    // nothing
  }

  /* Load the images for drawing the game.
   * Then, set init as the callback method, so when these images are loaded the game will start.
   */
  Resources.load([
      'images/block-grass.png',
      'images/block-stone.png',
      'images/char-boy.png',
      'images/char-boy-key.png',
      'images/char-cat-girl.png',
      'images/enemy-bug.png',
      'images/key.png',
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png',
      'images/rock.png',
      'images/level-spot.png',
      'images/blood-splatter.png'
  ]);
  Resources.onReady(init);

  // Assign the canvas' context object to the global variable so it could be used more easily from the app.js file.
  global.ctx = ctx;
})(this);
