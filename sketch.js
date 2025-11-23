// =============================
// 🎮 STUDENT AREA (EDIT THIS)
// =============================

let game;
let score1 = 0; // Player 1 (left)
let score2 = 0; // Player 2 (right)
// Example toggle: when true the sketch will disable the engine's automatic
// collisions and show how students can detect strikes and call the
// helper bounce methods (reflectFromPaddle / bounceVertical).
// Flip to false to use the built-in engine collisions.
let manualCollisionExample = true;

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // Students can experiment with these later (preferred tidy names):
  // game.setPaddlesXY(100, 80, 300, 200);   // both paddles (x,y each)
  // game.setLeftPaddle(80, 80);            // just left (x,y)
  // game.setRightPaddle(320, 220);         // just right (x,y)
  game.setPaddleColors("red", "red");
  // game.setBallSpeed(4);
  // game.setPaddleSpeed(6);

  // Enable/disable engine collisions depending on the example toggle.
  if (manualCollisionExample) {
    // Students will detect collisions and call the bounce helpers themselves.
    game.setPaddleCollisionEnabled(false);
    game.setWallBounceEnabled(false);
  } else {
    // For *basic working pong*, keep built-in collisions on.
    // Note: paddle collision is enabled by default in the engine.
    // game.setPaddleCollisionEnabled(true);
    // game.setWallBounceEnabled(true);
  }
}

function draw() {
  background(0);

  // Move and draw everything
  game.update();
  game.show();

  // -----------------------------
  // EXAMPLE: manual collision handling
  // If `manualCollisionExample` is true (set at top of file) this shows how
  // students can detect hits and call the engine bounce helpers themselves.
  // This is useful when you have disabled the built-in collisions to
  // implement custom logic.
  // -----------------------------
  if (manualCollisionExample) {
    // Paddle hits
    const ph = game.checkPaddleHit();
    if (ph === "left") {
      // Reflect with angle based on contact position on the left paddle
      game.reflectFromPaddle("left", game.ballY);
      // Nudge the ball out of the paddle so it doesn't immediately re-trigger
      game.ballX = game.paddle1X + game.paddleW + game.ballRadius + 1;
    } else if (ph === "right") {
      game.reflectFromPaddle("right", game.ballY);
      game.ballX = game.paddle2X - game.ballRadius - 1;
    }

    // Top/bottom wall hits
    const wh = game.checkWallHit();
    if (wh === "top" || wh === "bottom") {
      // Simple vertical bounce
      game.bounceVertical();
      if (wh === "top") game.ballY = game.ballRadius + 1;
      else game.ballY = height - game.ballRadius - 1;
    }
  }

  // --- STUDENT SCORE LOGIC ---

  // 1. Check which wall the ball has hit
  let wall = game.checkWallHit();

  if (wall === "left") {
    // Ball went off left side → Player 2 scores
    score2++;
    game.resetBall();
  } else if (wall === "right") {
    // Ball went off right side → Player 1 scores
    score1++;
    game.resetBall();
  }

  // 2. Draw the scores
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(score1, width / 4, 30);
  text(score2, (width * 3) / 4, 30);
}

// =====================================
// PongGame class moved to `pong_game.js` (keeps engine separate from student edits)
