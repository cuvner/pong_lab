function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: true });
  game.setPaddleColors("orange", "cyan");
  game.setPaddleSpeed(5);
  game.setupScoring();
}

function draw() {
  background(0);
  game.update();
  game.show();

  const ph = game.checkPaddleHit();
  if (ph === "left") {
    // engine can infer the contact Y from its internal ball position
    // and will nudge the ball out of the paddle automatically, so you
    // don't need to set `game.ballX` yourself.
    game.reflectFromPaddle("left");
  } else if (ph === "right") {
    game.reflectFromPaddle("right");
  }

  const wall = game.checkWallHit();
  if (wall === "left") {
    // right player scored
    game.player2Scored();
    game.resetBall();
  } else if (wall === "right") {
    game.player1Scored();
    game.resetBall();
  }

  // Top/bottom wall bounces are handled by the engine automatically even
  // when `manualCollision:true` is set — students don't need to implement
  // these checks or nudge the ball themselves.
}
