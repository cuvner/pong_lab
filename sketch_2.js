// =============================
// 🎮 STUDENT AREA (EDIT THIS)
// =============================

// Example toggle: flip to false to use engine automatic collisions
let manualCollisionExample = true;

// Game + scores
let game;
let score1 = 0; // Player 1 (left)
let score2 = 0; // Player 2 (right)

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // --- initial settings students can tweak ---
  // Place paddles using X,Y (left paddle, right paddle)
  game.setPaddlesXY(10, height / 2 - 25, width - 20, height / 2 - 25);

  // Or try moving them inward/outward:
  // game.setPaddlesXY(30, 100, width - 40, 100);

  game.setPaddleColors("cyan", "magenta");

  // Adjust speeds
  game.setBallSpeed(4); // ball movement magnitude
  game.setPaddleSpeed(5); // how fast paddles move when keys pressed

  // Example mode: students do detection & bouncing themselves
  if (manualCollisionExample) {
    game.setPaddleCollisionEnabled(false);
    game.setWallBounceEnabled(false);
  } else {
    // Use engine automatic collisions
    game.setPaddleCollisionEnabled(true);
    game.setWallBounceEnabled(true);
  }
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
      // Pass 'left' and the contact Y (we use game.ballY).
      game.reflectFromPaddle("left", game.ballY);
      // Nudge the ball just outside the paddle to avoid repeated triggers:
      game.ballX = game.paddle1X + game.paddleW + game.ballRadius + 1;
    } else if (ph === "right") {
      game.reflectFromPaddle("right", game.ballY);
      game.ballX = game.paddle2X - game.ballRadius - 1;
    }

    // 2) Wall detection (top/bottom)
    const wh = game.checkWallHit(); // "top", "bottom", "left", "right", or "none"
    if (wh === "top" || wh === "bottom") {
      // simple vertical bounce helper
      game.bounceVertical();
      // Nudge the ball inside the canvas:
      if (wh === "top") {
        game.ballY = game.ballRadius + 1;
      } else {
        game.ballY = height - game.ballRadius - 1;
      }
    }
  }

  // --- Scoring: check left/right edges (consistent with the engine) ---
  let wall = game.checkWallHit();
  if (wall === "left") {
    score2++;
    game.resetBall();
  } else if (wall === "right") {
    score1++;
    game.resetBall();
  }

  // Draw scores and instructions
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(score1, width / 4, 28);
  text(score2, (width * 3) / 4, 28);

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
