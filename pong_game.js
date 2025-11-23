// =====================================
// 🚫 DO NOT EDIT: PONG GAME CLASS
// =====================================
// Moved out of `sketch.js` so students can edit the top of the sketch
// without scrolling through the engine implementation.

class PongGame {
  // Accept an optional options object: { manualCollision: true }
  constructor(options = {}) {
    // Ball
    this.ballSize = 10;
    this.ballRadius = this.ballSize / 2;
    this.ballX = width / 2;
    this.ballY = height / 2;
    this.ballXSpeed = 3;
    this.ballYSpeed = 3;

    // Paddles
    this.paddleW = 10;
    this.paddleH = 50;
    this.paddleSpeed = 5;

    this.paddle1X = 10;
    this.paddle1Y = height / 2 - this.paddleH / 2;

    this.paddle2X = width - 10 - this.paddleW;
    this.paddle2Y = height / 2 - this.paddleH / 2;

    // Paddle colours
    this.paddle1Colour = color(255);
    this.paddle2Colour = color(255);

    // Collision flags (default: engine handles collisions)
    this.usePaddleCollision = true;
    this.useWallBounce = true;

    // Scoring (disabled by default)
    this.scoringEnabled = false;
    this.score1 = 0;
    this.score2 = 0;

    // Honor constructor option to disable automatic collisions for manual handling
    if (options && options.manualCollision) {
      // disable automatic engine collisions when manual collision mode requested
      this.setPaddleCollisionEnabled(false);
      this.setWallBounceEnabled(false);
      this.manualCollision = true;
    } else {
      this.manualCollision = false;
    }
  }

  // ======= Scoring helpers =======
  // Call this from your sketch's setup() to initialise scoring if you
  // want the engine to track points and reset the ball on score.
  // If the engine is in manualCollision mode, scoring will remain disabled
  // and the ball won't be automatically reset.
  setupScoring() {
    // Only enable scoring when not in manual collision mode
    if (this.manualCollision) {
      this.scoringEnabled = false;
      return;
    }

    this.scoringEnabled = true;
    this.score1 = 0;
    this.score2 = 0;
    // Give a consistent start position
    this.resetBall();
  }

  // Toggle scoring at runtime. If manualCollision is true, scoring will
  // not be enabled.
  setScoringEnabled(enabled) {
    const e = !!enabled;
    if (e && this.manualCollision) {
      // don't enable scoring while in manual collision mode
      this.scoringEnabled = false;
      return;
    }
    this.scoringEnabled = e;
    if (this.scoringEnabled) {
      this.score1 = 0;
      this.score2 = 0;
    }
  }

  // ============= PUBLIC METHODS (for students) =============

  // Set both paddles at once (Y positions)
  // --- Canonical public API (preferred names) ---
  // Set both paddles' X and Y positions
  setPaddlesXY(p1X, p1Y, p2X, p2Y) {
    this.paddle1X = constrain(p1X, 0, width - this.paddleW);
    this.paddle1Y = constrain(p1Y, 0, height - this.paddleH);

    this.paddle2X = constrain(p2X, 0, width - this.paddleW);
    this.paddle2Y = constrain(p2Y, 0, height - this.paddleH);
  }

  // Set left (player 1) paddle X,Y
  setLeftPaddle(x, y) {
    this.paddle1X = constrain(x, 0, width - this.paddleW);
    this.paddle1Y = constrain(y, 0, height - this.paddleH);
  }

  // Set right (player 2) paddle X,Y
  setRightPaddle(x, y) {
    this.paddle2X = constrain(x, 0, width - this.paddleW);
    this.paddle2Y = constrain(y, 0, height - this.paddleH);
  }

  // Set paddle colours (US spelling)
  setPaddleColors(c1, c2) {
    this.paddle1Colour = color(c1);
    this.paddle2Colour = color(c2);
  }

  // Explicit setters for collision flags
  setPaddleCollisionEnabled(enabled) {
    this.usePaddleCollision = !!enabled;
  }

  setWallBounceEnabled(enabled) {
    this.useWallBounce = !!enabled;
  }

  // Convenience setter: when `true` the engine will NOT auto-handle collisions
  // (useful for student examples that implement collisions manually).
  setManualCollision(enabled) {
    const m = !!enabled;
    // If manual is true, disable engine collision/bounce; otherwise enable them.
    this.setPaddleCollisionEnabled(!m);
    this.setWallBounceEnabled(!m);
    this.manualCollision = m;
  }

  // Bounce helpers (short, tidy names)
  bounceHorizontal() {
    this.ballXSpeed *= -1;
  }

  bounceVertical() {
    this.ballYSpeed *= -1;
  }

  // Convenience bounce by descriptor
  bounceFrom(hit) {
    if (!hit || typeof hit !== "string") return;
    const h = hit.toLowerCase();
    if (h === "top" || h === "bottom" || h === "vertical") {
      this.bounceVertical();
    } else if (
      h === "left" ||
      h === "right" ||
      h === "paddle" ||
      h === "horizontal"
    ) {
      this.bounceHorizontal();
    }
  }

  // Paddle reflection helper (preferred name)
  reflectFromPaddle(side, contactY) {
    // Normalize side
    const s =
      typeof side === "number"
        ? side === 1
          ? "left"
          : "right"
        : String(side).toLowerCase();

    // Determine paddle center Y
    let paddleYCenter;
    if (s === "left" || s === "1") {
      paddleYCenter = this.paddle1Y + this.paddleH / 2;
    } else {
      paddleYCenter = this.paddle2Y + this.paddleH / 2;
    }

    // Relative hit position (-1 at top edge, 0 center, +1 bottom edge)
    const rel = constrain(
      (contactY - paddleYCenter) / (this.paddleH / 2),
      -1,
      1
    );

    // Max deflection angle from horizontal (degrees)
    const maxDeg = 75;
    const maxRad = (maxDeg * Math.PI) / 180;

    // Angle relative to horizontal
    const angle = rel * maxRad; // -max..+max

    // Preserve current ball speed magnitude
    const speed = Math.hypot(this.ballXSpeed, this.ballYSpeed) || 3;

    // For left paddle, ball should go right (+x); for right paddle, left (-x)
    const dir = s === "left" ? 1 : -1;

    this.ballXSpeed = Math.cos(angle) * speed * dir;
    this.ballYSpeed = Math.sin(angle) * speed;
  }

  // Change ball speed (keeps current direction)
  setBallSpeed(speed) {
    const sx = this.ballXSpeed === 0 ? 1 : Math.sign(this.ballXSpeed);
    const sy = this.ballYSpeed === 0 ? 1 : Math.sign(this.ballYSpeed);
    this.ballXSpeed = speed * sx;
    this.ballYSpeed = speed * sy;
  }

  // Change paddle speed
  setPaddleSpeed(speed) {
    this.paddleSpeed = speed;
  }

  // (collision flags managed via setPaddleCollisionEnabled / setWallBounceEnabled)

  // Check which paddle (if any) was hit
  // returns "left", "right" or "none"
  checkPaddleHit() {
    return this._detectPaddleHit();
  }

  // Check which wall (if any) was hit
  // returns "left", "right", "top", "bottom" or "none"
  checkWallHit() {
    return this._detectWallHit();
  }

  // Reset ball to centre and reverse X direction
  resetBall() {
    this.ballX = width / 2;
    this.ballY = height / 2;
    this.ballXSpeed *= -1;
  }

  // Public methods students can call when handling scoring themselves
  // These do NOT reset the ball so students can control the flow when
  // in manual collision mode. The engine's automatic scoring path will
  // still call _scorePoint() which does reset the ball.
  player1Scored() {
    this.score1 = (this.score1 || 0) + 1;
  }

  player2Scored() {
    this.score2 = (this.score2 || 0) + 1;
  }

  // (bounce helpers implemented via tidy names above)

  // ============= GAME LOOP METHODS =============

  update() {
    this._moveBall();
    if (this.useWallBounce) {
      this._autoWallBounce();
    }
    // Handle scoring if enabled (left/right walls count as points)
    if (this.scoringEnabled) {
      this._handleScoring();
    }
    this._handleInput();
    this._keepPaddlesOnScreen();
    if (this.usePaddleCollision) {
      this._autoPaddleBounce();
    }
  }

  show() {
    // Ball
    fill(255);
    circle(this.ballX, this.ballY, this.ballSize);

    // Paddles
    fill(this.paddle1Colour);
    rect(this.paddle1X, this.paddle1Y, this.paddleW, this.paddleH);

    fill(this.paddle2Colour);
    rect(this.paddle2X, this.paddle2Y, this.paddleW, this.paddleH);

    // Centre line
    stroke(255);
    line(width / 2, 0, width / 2, height);
    noStroke();

    // Draw scores inside the engine when scoring is enabled OR when
    // scores exist (so students using manual mode and calling
    // player1Scored()/player2Scored() still see the values).
    const shouldShowScores =
      this.scoringEnabled || (this.score1 || 0) > 0 || (this.score2 || 0) > 0;
    if (shouldShowScores) {
      // Use readable styling but avoid interfering with student sketches
      fill(255);
      textSize(24);
      textAlign(CENTER);
      text(this.score1 || 0, width / 4, 30);
      text(this.score2 || 0, (width * 3) / 4, 30);
    }
  }

  // ============= INTERNAL HELPERS =============

  _moveBall() {
    this.ballX += this.ballXSpeed;
    this.ballY += this.ballYSpeed;
  }

  _handleInput() {
    // W/S for left paddle
    if (keyIsDown(87)) {
      // 'W'
      this.paddle1Y -= this.paddleSpeed;
    }
    if (keyIsDown(83)) {
      // 'S'
      this.paddle1Y += this.paddleSpeed;
    }

    // UP/DOWN arrows for right paddle
    if (keyIsDown(UP_ARROW)) {
      this.paddle2Y -= this.paddleSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.paddle2Y += this.paddleSpeed;
    }
  }

  _keepPaddlesOnScreen() {
    this.paddle1Y = constrain(this.paddle1Y, 0, height - this.paddleH);
    this.paddle2Y = constrain(this.paddle2Y, 0, height - this.paddleH);
  }

  // Just handles auto bounce on top/bottom
  _autoWallBounce() {
    const wall = this._detectWallHit();
    if (wall === "top" || wall === "bottom") {
      this.ballYSpeed *= -1;
    }
  }

  _autoPaddleBounce() {
    const hit = this._detectPaddleHit();
    if (hit === "left" || hit === "right") {
      this.ballXSpeed *= -1;
    }
  }

  _detectPaddleHit() {
    // Left paddle
    const hitLeft =
      this.ballX - this.ballRadius <= this.paddle1X + this.paddleW &&
      this.ballY + this.ballRadius >= this.paddle1Y &&
      this.ballY - this.ballRadius <= this.paddle1Y + this.paddleH;

    if (hitLeft) return "left";

    // Right paddle
    const hitRight =
      this.ballX + this.ballRadius >= this.paddle2X &&
      this.ballY + this.ballRadius >= this.paddle2Y &&
      this.ballY - this.ballRadius <= this.paddle2Y + this.paddleH;

    if (hitRight) return "right";

    return "none";
  }

  _detectWallHit() {
    // Top and bottom use the ball's edges
    if (this.ballY - this.ballRadius <= 0) {
      return "top";
    }
    if (this.ballY + this.ballRadius >= height) {
      return "bottom";
    }

    // Left and right (for scoring) – use inner edges
    if (this.ballX - this.ballRadius <= 0) {
      return "left";
    }
    if (this.ballX + this.ballRadius >= width) {
      return "right";
    }

    return "none";
  }

  // Scoring internal helpers
  _handleScoring() {
    const wall = this._detectWallHit();
    if (wall === "left") {
      // Right player scored
      this._scorePoint(2);
    } else if (wall === "right") {
      // Left player scored
      this._scorePoint(1);
    }
  }

  _scorePoint(player) {
    if (player === 1) this.score1 = (this.score1 || 0) + 1;
    else if (player === 2) this.score2 = (this.score2 || 0) + 1;

    // After scoring, reset the ball to the centre for the next serve
    this.resetBall();
  }
}
