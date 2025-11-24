const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

// Read the engine file
const code = fs.readFileSync(
  path.resolve(__dirname, "../pong_game.js"),
  "utf8"
);

// Minimal p5-like stubs needed by the engine's constructor
const context = {
  // canvas dimensions used by the engine
  width: 400,
  height: 300,

  // p5 helpers used during construction / methods
  color: (c) => c,
  constrain: (v, a, b) => Math.max(a, Math.min(b, v)),

  // key constants / functions used by internal helpers (we won't simulate key presses)
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  keyIsDown: () => false,

  // minimal drawing stubs (not exercised by smoke test but present so show() can be called)
  fill: () => {},
  circle: () => {},
  rect: () => {},
  stroke: () => {},
  line: () => {},
  noStroke: () => {},
  textSize: () => {},
  textAlign: () => {},
  text: () => {},

  console,
};

vm.createContext(context);

try {
  // Evaluate the engine in the prepared context
  vm.runInContext(code, context, { filename: "pong_game.js" });

  // Verify class exists
  // Sometimes top-level declarations are not visible as properties; check via an eval inside the context too.
  const typeofInContext = vm.runInContext("typeof PongGame", context);
  // Debug output if missing
  if (typeofInContext !== "function") {
    console.error(
      "DEBUG: keys on context ->",
      Object.keys(context).slice(0, 200)
    );
    console.error("DEBUG: typeof PongGame (in-context) ->", typeofInContext);
  }
  assert.strictEqual(
    typeofInContext,
    "function",
    "PongGame should be a constructor (in-context)"
  );

  // Instantiate
  const game = new (vm.runInContext("PongGame", context))();

  // Check the canonical public API methods exist
  const expected = [
    "setLeftPaddle",
    "setRightPaddle",
    "setPaddleColors",
    "setBallSpeed",
    "setBallSize",
    "setPaddleSpeed",
    "setPaddleCollisionEnabled",
    "setManualCollision",
    "setupScoring",
    "setScoringEnabled",
    "checkPaddleHit",
    "checkWallHit",
    "consumePaddleHit",
    "clearPaddleHit",
    "getPaddleContactFraction",
    "consumeWallHit",
    "getScores",
    "getPlayerScore",
    "player1Scored",
    "player2Scored",
    "manualCollisionAssist",
    "resetBall",
    "bounceHorizontal",
    "bounceVertical",
    "bounceFrom",
    "bounceLeft",
    "bounceRight",
    "bounceTop",
    "bounceBottom",
    "reflectFromPaddle",
    "update",
    "show",
  ];

  expected.forEach((name) => {
    assert.strictEqual(
      typeof game[name],
      "function",
      `game.${name} should be a function`
    );
  });

  // Call a few methods to ensure they run without throwing and affect state
  game.setLeftPaddle(10, 10);
  game.setRightPaddle(380, 10);
  game.setBallSpeed(4);
  game.setBallSize(20);
  game.setPaddleSpeed(5);
  game.setPaddleCollisionEnabled(false);
  game.update();

  // Manual collision toggle should flip the paddle collision flag
  assert.strictEqual(game.usePaddleCollision, false);
  game.setManualCollision(true);
  assert.strictEqual(game.usePaddleCollision, false);
  assert.strictEqual(game.manualCollision, true);
  game.setManualCollision(false);
  assert.strictEqual(game.usePaddleCollision, true);
  assert.strictEqual(game.manualCollision, false);

  // Construct with the manualCollision option and verify it disables paddle collisions
  const game2 = new (vm.runInContext("PongGame", context))({
    manualCollision: true,
  });
  // When manualCollision:true we expect the engine to disable paddle collisions
  // so students can implement their own paddle logic; wall bounce is always
  // handled by the engine (no flag needed).
  if (game2.usePaddleCollision !== false) {
    throw new Error(
      "Constructor option { manualCollision: true } should disable paddle collisions"
    );
  }

  // manualCollisionAssist should detect a paddle hit and return useful info
  game2.paddle1X = 0;
  game2.paddle1Y = 100;
  game2.ballX = game2.paddle1X + game2.paddleW - game2.ballRadius;
  game2.ballY = game2.paddle1Y + game2.paddleH / 2;
  const assist = game2.manualCollisionAssist();
  assert.deepStrictEqual(assist.hit, "left");
  assert.strictEqual(typeof assist.contactFraction, "number");

  // consumeWallHit should only report a wall once until the ball returns
  game2.ballX = -1;
  const wall1 = game2.consumeWallHit();
  const wall2 = game2.checkWallHit();
  assert.strictEqual(wall1, "left");
  assert.strictEqual(wall2, "none");

  // Scoring path: enabling scoring and crossing a wall should increment and reset
  const game3 = new (vm.runInContext("PongGame", context))();
  game3.setupScoring();
  const canvasWidth = context.width;
  game3.ballX = canvasWidth - game3.ballRadius; // will move beyond the right wall on update
  game3.ballXSpeed = Math.abs(game3.ballXSpeed) || 3;
  game3.update();
  const scores = game3.getScores();
  assert.strictEqual(scores.player1, 1);
  assert.strictEqual(scores.player2, 0);
  assert.strictEqual(game3.ballX, canvasWidth / 2);

  console.log("SMOKE TEST: PASS");
  process.exit(0);
} catch (err) {
  console.error("SMOKE TEST: FAIL");
  console.error(err && err.stack ? err.stack : err);
  process.exit(2);
}
