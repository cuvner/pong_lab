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

    // Simple state properties for classroom use. Students can read these
    // inside `draw()` and call simple helpers like `game.bounceRight()`.
    this.paddleHit = "none"; // 'left'|'right'|'none'
    this.wallHit = "none"; // 'left'|'right'|'top'|'bottom'|'none'
    // Internal helpers to prevent repeated scoring in manual mode
    this._wallConsumed = false; // whether the current wall hit was consumed
    this._consumedWall = null; // which wall was consumed ('left'|'right')

    // Honor constructor option to disable automatic collisions for manual handling
    if (options && options.manualCollision) {
      // disable automatic paddle collisions when manual collision mode requested
      // but keep top/bottom wall bounce enabled so students don't need to
      // implement wall bounces themselves.
      this.setPaddleCollisionEnabled(false);
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

  // (Individual paddle setters below — setPaddlesXY removed)

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
    // If manual is true, disable engine paddle collisions only; keep
    // top/bottom wall bounce enabled so students don't need to handle walls.
    this.setPaddleCollisionEnabled(!m);
    this.manualCollision = m;
  }

  // Bounce helpers (short, tidy names)
  bounceHorizontal() {
    this.ballXSpeed *= -1;
  }

  bounceVertical() {
    this.ballYSpeed *= -1;
  }

  // Simple helpers for classroom use (explicit directions)
  bounceRight() {
    const speed = Math.hypot(this.ballXSpeed, this.ballYSpeed) || 3;
    this.ballXSpeed = Math.abs(this.ballXSpeed) || Math.max(1, speed);
  }

  bounceLeft() {
    const speed = Math.hypot(this.ballXSpeed, this.ballYSpeed) || 3;
    this.ballXSpeed = -Math.abs(this.ballXSpeed) || -Math.max(1, speed);
  }

  bounceTop() {
    const speed = Math.hypot(this.ballXSpeed, this.ballYSpeed) || 3;
    this.ballYSpeed = -Math.abs(this.ballYSpeed) || -Math.max(1, speed);
  }

  bounceBottom() {
    const speed = Math.hypot(this.ballXSpeed, this.ballYSpeed) || 3;
    this.ballYSpeed = Math.abs(this.ballYSpeed) || Math.max(1, speed);
  }

  // Convenience helpers for simple student workflows
  // consumePaddleHit(): returns the current paddleHit value and clears it
  // so student code can do: const hit = game.consumePaddleHit(); if (hit==='left') { game.bounceRight(); }
  consumePaddleHit() {
    const h = this.paddleHit || "none";
    this.paddleHit = "none";
    return h;
  }

  // clearPaddleHit(): clear the current paddleHit without reading it
  clearPaddleHit() {
    this.paddleHit = "none";
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

    // If contactY not provided, use the current ball Y from the engine
    const cY = typeof contactY === "number" ? contactY : this.ballY;

    // Relative hit position (-1 at top edge, 0 center, +1 bottom edge)
    const rel = constrain((cY - paddleYCenter) / (this.paddleH / 2), -1, 1);

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
    // Nudge the ball slightly out of the paddle to avoid immediate re-trigger
    // when students call this helper directly from their sketches.
    if (s === "left") {
      this.ballX = this.paddle1X + this.paddleW + this.ballRadius + 1;
    } else if (s === "right") {
      this.ballX = this.paddle2X - this.ballRadius - 1;
    }
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

  // Convenience for younger students: return normalized contact fraction
  // -1 => top edge, 0 => center, +1 => bottom edge
  // Accepts 'left' or 'right' (or 1/2). Returns null when side is invalid.
  getPaddleContactFraction(side) {
    const s = String(side).toLowerCase();
    let paddleYCenter;
    if (s === "left" || s === "1") {
      paddleYCenter = this.paddle1Y + this.paddleH / 2;
    } else if (s === "right" || s === "2") {
      paddleYCenter = this.paddle2Y + this.paddleH / 2;
    } else {
      return null;
    }
    const rel = constrain(
      (this.ballY - paddleYCenter) / (this.paddleH / 2),
      -1,
      1
    );
    return rel;
  }

  // Assisted manual collision helper for younger students.
  // Call this inside `draw()` when you have `manualCollision` enabled.
  // It will detect paddle and wall hits, apply the engine's reflection
  // helpers, nudge the ball out of paddles to avoid repeat triggers,
  // and return a small object describing the event:
  // { hit: 'left'|'right'|'top'|'bottom'|'none', contactFraction }
  manualCollisionAssist() {
    // Paddle hits
    const ph = this._detectPaddleHit();
    if (ph === "left") {
      this.reflectFromPaddle("left", this.ballY);
      this.ballX = this.paddle1X + this.paddleW + this.ballRadius + 1;
      return {
        hit: "left",
        contactFraction: this.getPaddleContactFraction("left"),
      };
    } else if (ph === "right") {
      this.reflectFromPaddle("right", this.ballY);
      this.ballX = this.paddle2X - this.ballRadius - 1;
      return {
        hit: "right",
        contactFraction: this.getPaddleContactFraction("right"),
      };
    }

    // Top/bottom walls
    const wh = this._detectWallHit();
    if (wh === "top" || wh === "bottom") {
      this.bounceVertical();
      if (wh === "top") this.ballY = this.ballRadius + 1;
      else this.ballY = height - this.ballRadius - 1;
      return { hit: wh, contactFraction: null };
    }

    // No collision
    return { hit: "none", contactFraction: null };
  }

  // consumeWallHit(): returns the current left/right wall hit and marks it
  // consumed so repeated calls (or frames) won't report it again until the
  // ball returns to play. Use in manual-scoring sketches to safely increment
  // a score once per crossing:
  // const wall = game.consumeWallHit(); if (wall === 'left') game.player2Scored();
  consumeWallHit() {
    const w = this._detectWallHit();
    if (w === "left" || w === "right") {
      // mark consumed and remember which wall
      this._wallConsumed = true;
      this._consumedWall = w;
      return w;
    }
    return "none";
  }

  // Simple collision+scoring step: a single-call helper that detects
  // paddle/wall hits, applies reflection, and optionally handles scoring.
  // Usage: const result = game.simpleCollisionStep({ autoScore: true, autoReset: true });
  // Returns { hit, contactFraction, scored: 'left'|'right'|'none' }
  simpleCollisionStep(options = {}) {
    const { autoScore = false, autoReset = false } = options;

    // First handle paddles & walls using the assist helper
    const assist = this.manualCollisionAssist();
    if (
      assist.hit === "left" ||
      assist.hit === "right" ||
      assist.hit === "top" ||
      assist.hit === "bottom"
    ) {
      // If a left/right wall was hit earlier, manualCollisionAssist would have returned 'none'
      // so scoring handled below via wall detection.
    }

    // Check for left/right scoring walls explicitly
    const wall = this._detectWallHit();
    if (wall === "left" || wall === "right") {
      if (autoScore) {
        // engine internal scoring increments and resets ball
        if (wall === "left") this._scorePoint(2);
        else this._scorePoint(1);
        return { hit: wall, contactFraction: null, scored: wall };
      } else {
        // do not reset; let caller increment via player1Scored/player2Scored
        return { hit: wall, contactFraction: null, scored: "none" };
      }
    }

    return {
      hit: assist.hit,
      contactFraction: assist.contactFraction,
      scored: "none",
    };
  }

  // Check which wall (if any) was hit
  // returns "left", "right", "top", "bottom" or "none"
  checkWallHit() {
    // If a left/right wall was consumed recently, don't report it again
    const raw = this._detectWallHit();
    if (this._wallConsumed && raw === this._consumedWall) return "none";
    return raw;
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
    // expose simple state for students to read
    this.paddleHit = this._detectPaddleHit();
    this.wallHit = this._detectWallHit();
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
    const wall = this.wallHit || this._detectWallHit();
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
