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
    "setPaddlesXY",
    "setLeftPaddle",
    "setRightPaddle",
    "setPaddleColors",
    "setBallSpeed",
    "setPaddleSpeed",
    "setPaddleCollisionEnabled",
    "setWallBounceEnabled",
    "checkPaddleHit",
    "checkWallHit",
    "resetBall",
    "bounceHorizontal",
    "bounceVertical",
    "bounceFrom",
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

  // Call a few methods to ensure they run without throwing
  game.setPaddlesXY(10, 10, 380, 10);
  game.setBallSpeed(4);
  game.setPaddleSpeed(5);
  game.setPaddleCollisionEnabled(false);
  game.setWallBounceEnabled(false);
  game.update();

  console.log("SMOKE TEST: PASS");
  process.exit(0);
} catch (err) {
  console.error("SMOKE TEST: FAIL");
  console.error(err && err.stack ? err.stack : err);
  process.exit(2);
}
