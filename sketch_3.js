// === BEGINNER: copy this into the STUDENT AREA of sketch.js ===
// Don't worry about the other code — this is all you need to try the game.

// Keep engine collisions on so the game works automatically
let manualCollisionExample = false;

function setup() {
  // Make the game window (do not change these numbers yet)
  createCanvas(400, 300);

  // Start the Pong engine — the variable `game` is used by the code below
  game = new PongGame();

  // Make the paddles easier to see and control
  game.setPaddleColors("red", "blue"); // left is red, right is blue
  game.setPaddleSpeed(5); // how fast the paddles move with keys
  game.setBallSpeed(4); // how fast the ball moves overall
}

// Now open index.html and play: use W/S to move the left paddle, and
// the Up/Down arrow keys to move the right paddle.
// === END COPY ===
