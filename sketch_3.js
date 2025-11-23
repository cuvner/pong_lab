// === BEGINNER: copy this into the STUDENT AREA of sketch.js ===
// Don't worry about the other code — this is all you need to try the game.

// Keep engine collisions on so the game works automatically
// (use the API `setManualCollision` on the `game` instance)

function setup() {
  // Make the game window (do not change these numbers yet)
  createCanvas(400, 300);

  // Start the Pong engine — the variable `game` is used by the code below
  // Primary pattern for beginners: construct with the manualCollision option
  //   game = new PongGame();
  // Alternative: construct normally then call the setter
  game = new PongGame();
  game.setManualCollision(false);

  // Make the paddles easier to see and control
  game.setPaddleColors("red", "blue"); // left is red, right is blue
  game.setPaddleSpeed(5); // how fast the paddles move with keys
  game.setBallSpeed(1); // how fast the ball moves overall
  // Initialise scoring for the beginner automatic-collision setup
  game.setupScoring();
  // (Constructor above already set manualCollision=false) but calling the
  // setter here is also fine if you prefer the setter pattern.
  // game.setManualCollision(false);
  // Alternatively, construct with manualCollision disabled explicitly:
  // game = new PongGame({ manualCollision: false });
}

function draw() {
  // Clear screen and run the game loop (this is required)
  background(0);
  game.update();
  game.show();
}

// Now open index.html and play: use W/S to move the left paddle, and
// the Up/Down arrow keys to move the right paddle.
// === END COPY ===
