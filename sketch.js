// =============================
// 🎮 STUDENT AREA (EDIT THIS)
// =============================

let game;
// Example toggle: when true the sketch will disable the engine's automatic
// collisions and show how students can detect strikes and call the
// helper bounce methods (reflectFromPaddle / bounceVertical).
// Flip to false to use the built-in engine collisions.
// Toggle this to `true` to practice manual collision handling, or `false`
// to let the engine do collisions automatically. Default: automatic collisions.
let manualCollisionExample = false;

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

  // Use the convenience API to enable/disable automatic collisions.
  // This is clearer than toggling engine internals directly.
  game.setManualCollision(manualCollisionExample);
  // Initialise scoring only when not in manual collision mode
  game.setupScoring();
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
