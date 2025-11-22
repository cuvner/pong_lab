// =============================
// 🎮 STUDENT AREA (EDIT THIS)
// =============================

let game;
let score1 = 0; // Player 1 (left)
let score2 = 0; // Player 2 (right)

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // Students can experiment with these later:
  // game.setPaddlePositions(100, 200);   // both paddles
  // game.setPaddle1Position(80);        // just left
  // game.setPaddle2Position(220);       // just right
  game.setPaddleColours("red", "red");
  // game.setBallSpeed(4);
  // game.setPaddleSpeed(6);

  // For *basic working pong*, we keep built-in collisions on:
  game.disablePaddleCollision();
  // game.disableWallBounce();
}

function draw() {
  background(0);

  // Move and draw everything
  game.update();
  game.show();

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
// 🚫 DO NOT EDIT: PONG GAME CLASS
// =====================================

class PongGame {
  constructor() {
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

    // Collision flags
    this.usePaddleCollision = true;
    this.useWallBounce = true;
  }

  // ============= PUBLIC METHODS (for students) =============

  // Set both paddles at once (Y positions)
  setPaddlePositions(p1Y, p2Y) {
    this.paddle1Y = constrain(p1Y, 0, height - this.paddleH);
    this.paddle2Y = constrain(p2Y, 0, height - this.paddleH);
  }

  // Set paddle 1 (left)
  setPaddle1Position(y) {
    this.paddle1Y = constrain(y, 0, height - this.paddleH);
  }

  // Set paddle 2 (right)
  setPaddle2Position(y) {
    this.paddle2Y = constrain(y, 0, height - this.paddleH);
  }

  // Change paddle colours
  setPaddleColours(c1, c2) {
    this.paddle1Colour = color(c1);
    this.paddle2Colour = color(c2);
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

  // Turn built-in paddle collision ON/OFF
  enablePaddleCollision() {
    this.usePaddleCollision = true;
  }

  disablePaddleCollision() {
    this.usePaddleCollision = false;
  }

  // Turn built-in top/bottom wall bounce ON/OFF
  enableWallBounce() {
    this.useWallBounce = true;
  }

  disableWallBounce() {
    this.useWallBounce = false;
  }

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

  // ============= GAME LOOP METHODS =============

  update() {
    this._moveBall();
    if (this.useWallBounce) {
      this._autoWallBounce();
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
  }

  // ============= INTERNAL HELPERS =============

  _moveBall() {
    this.ballX += this.ballXSpeed;
    this.ballY += this.ballYSpeed;
  }

  _handleInput() {
    // W/S for left paddle
    if (keyIsDown(87)) { // 'W'
      this.paddle1Y -= this.paddleSpeed;
    }
    if (keyIsDown(83)) { // 'S'
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
}
