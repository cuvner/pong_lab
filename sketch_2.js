// STUDENT AREA
// Set true to practice manual collisions; engine otherwise handles collisions.
let manualCollisionExample = true;

// Quick example:
// if (game.paddleHit === 'left') { game.bounceRight(); game.clearPaddleHit(); }

let game;

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // --- initial settings students can tweak ---
  // Place paddles using X,Y (left paddle, right paddle)
  game.setLeftPaddle(10, height / 2 - 25);
  game.setRightPaddle(width - 20, height / 2 - 25);

  // Or try moving them inward/outward:
  // game.setLeftPaddle(30, 100);
  // game.setRightPaddle(width - 40, 100);

  game.setPaddleColors("cyan", "magenta");

  // Adjust speeds
  game.setBallSpeed(4); // ball movement magnitude
  game.setPaddleSpeed(5); // how fast paddles move when keys pressed

  // Toggle manual/automatic collision mode
  game.setManualCollision(manualCollisionExample);

  // Initialise scoring if appropriate (setupScoring will be a no-op in manual mode)
  game.setupScoring();
}

function draw() {
  background(0);

  // move & draw
  game.update();
  game.show();

  // -----------------------------
  // Student collision + scoring example
  // -----------------------------
  if (manualCollisionExample) {
    // 1) Paddle detection and realistic bounce
    const ph = game.checkPaddleHit(); // "left", "right", or "none"
    if (ph === "left") {
      // Use the helper that reflects based on contact position.
      // You can omit the contactY — the engine will use its internal ball Y.
      game.reflectFromPaddle("left");
    } else if (ph === "right") {
      game.reflectFromPaddle("right");
    }

    // 2) Top/bottom walls are handled by the engine automatically so
    // students don't need to implement wall detection or nudging here.
  }

  // Draw scores if scoring is enabled on the engine
  fill(255);
  textSize(20);
  textAlign(CENTER);
  if (game.scoringEnabled) {
    text(game.score1 || 0, width / 4, 28);
    text(game.score2 || 0, (width * 3) / 4, 28);
  }

  textSize(12);
  textAlign(LEFT);
  text("Left: W/S — Right: ↑/↓", 10, height - 10);
  textAlign(RIGHT);
  text(
    manualCollisionExample ? "Manual collision: ON" : "Manual collision: OFF",
    width - 10,
    height - 10
  );
}
