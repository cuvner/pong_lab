// STUDENT AREA
let game;
// Set to true to practice manual collisions; otherwise engine handles collisions.
let manualCollisionExample = false;

// Quick example:
// if (game.paddleHit === 'left') { game.bounceRight(); game.clearPaddleHit(); }

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // Try these later:
  // game.setLeftPaddle(80, 80);
  // game.setRightPaddle(320, 220);
  game.setPaddleColors("red", "red");
  // game.setBallSpeed(4);
  // game.setPaddleSpeed(6);

  // Toggle manual/automatic collision mode
  game.setManualCollision(manualCollisionExample);
  // Initialise scoring only when not in manual collision mode
  game.setupScoring();
}

function draw() {
  background(0);

  // Move and draw everything
  game.update();
  game.show();

  // Manual collision example
  if (manualCollisionExample) {
    // Paddle hits
    const ph = game.checkPaddleHit();
    if (ph === "left") {
      // Reflect based on where the ball hit the paddle
      game.reflectFromPaddle("left");
    } else if (ph === "right") {
      game.reflectFromPaddle("right");
    }
    // Top/bottom walls are handled by the engine
  }

  // Draw scores if the engine has scoring enabled
  if (game.scoringEnabled) {
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text(game.score1 || 0, width / 4, 30);
    text(game.score2 || 0, (width * 3) / 4, 30);
  }
}

// =====================================
// PongGame class moved to `pong_game.js` (keeps engine separate from student edits)
