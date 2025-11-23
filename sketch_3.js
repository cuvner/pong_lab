// === PADDLES POSITIONS & COLOURS: copy into the STUDENT AREA ===
// This sets where each paddle appears and what colour they are.
let manualCollisionExample = false; // keep engine collisions on for a working game

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // Place left paddle (x, y). y is measured from top of the screen.
  // height/2 - 25 roughly centres the paddle vertically.
  game.setLeftPaddle(30, height / 2 - 25);

  // Place right paddle (x, y). width - 40 keeps it near the right edge.
  game.setRightPaddle(width - 40, height / 2 - 25);

  // Make the paddles stand out
  game.setPaddleColors("orange", "cyan"); // left = orange, right = cyan

  // Make paddles a little quicker to move
  game.setPaddleSpeed(6);
}

function draw() {
  // Runs each frame: clear the screen and draw the game
  background(0);
  game.update();
  game.show();
}

// Now open index.html and play. Use W/S for the left paddle and
// Up/Down arrows for the right paddle.
// === END COPY ===
