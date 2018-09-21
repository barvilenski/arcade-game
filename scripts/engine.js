/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the game objects (defined in app.js).
 */

var Engine = (function(global) {
  /* Predefine variables that will be used within this scope,
   * create the canvas element, and add it to the DOM.
   */
  var doc = global.document,
      win = global.window,
      canvas = doc.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      lastTime;

  canvas.width = 505;
  canvas.height = 606;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    // Get the time delta information which is required for smooth animation.
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;  // Used to determine the time delta for the next time main function is called.
    win.requestAnimationFrame(main);  // Call main function again as soon as the browser is able to draw another frame.
  }

  // This function does some initial setup that should only occur once.
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  // This function calls all of the functions which may need to update entity's data.
  function update(dt) {
    updateEntities(dt);
    // checkCollisions();
  }

  /* This function loops through the game objects,
   * it calls their update() methods in order to update their data.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
  }

  // This function initially draws the "game level", and then draws the game objects.
  function render() {
    // This array holds the relative URL to the image used for each row of the game level.
    var rowImages = [
          'images/block-water.png',   // Top row is water
          'images/block-stone.png',   // Row 1 of 3 of stone
          'images/block-stone.png',   // Row 2 of 3 of stone
          'images/block-stone.png',   // Row 3 of 3 of stone
          'images/block-grass.png',   // Row 1 of 2 of grass
          'images/block-grass.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* Before drawing, clear existing canvas.
     * Then, draw each portion of the "game level grid" one after another.
     */
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        // By using the Resources helper to refer to images we get the benefits of caching these images
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /* This function loops through the game objects,
   * it calls their render() methods in order to draw them on the canvas.
   */
  function renderEntities() {
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
  }

  /* This function does nothing. It is a good place to handle game reset states
   * (a new game menu, a game over screen, etc...). It's called once by the init() method.
   */
  function reset() {
    // nothing
  }

  /* Load the images for drawing the game level.
   * Then, set init as the callback method, so when these images are loaded the game will start.
   */
  Resources.load([
      'images/block-stone.png',
      'images/block-water.png',
      'images/block-grass.png',
      'images/enemy-bug.png',
      'images/char-boy.png'
  ]);
  Resources.onReady(init);

  // Assign the canvas' context object to the global variable so it could be used more easily from the app.js file.
  global.ctx = ctx;
})(this);
