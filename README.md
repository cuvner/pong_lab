# pong_lab

Simple Pong teaching lab built with p5.js. The repo contains a small, student-editable `sketch.js` and the game engine in `pong_game.js`.

Table of contents

- Quick run
- What changed (scoring + manual collisions)
- Examples
  - Beginner starter
  - Paddles positions & colours
  - Manual collision
  - Manual scoring (example)
- API reference (short)
- Notes & tips

## Quick run

Open `index.html` in a browser, or serve the folder and visit the local server address. Example (from project root):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The page loads p5.js and `sketch.js`. The `PongGame` class is defined in `pong_game.js` and is available to the sketch as the global `game` variable after `setup()` runs.

Screenshots (optional)

Add screenshots to the repo and reference them here for teachers who want a printable handout. Example Markdown placeholder:

```markdown
![Gameplay screenshot](docs/screenshot-placeholder.png)
```

## What changed — scoring and manual collisions (short)

- New: engine-managed scoring. Call `game.setupScoring()` in your sketch's `setup()` (only when `manualCollision` is false) and the engine will automatically increment `game.score1` / `game.score2` and reset the ball after a point.
- Manual mode (`manualCollision: true`) disables automatic scoring/reset so students can experiment with a ball left in-play. Use `game.player1Scored()` / `game.player2Scored()` from your sketch to increment scores manually when you detect a scoring event — these helper methods DO NOT reset the ball so students keep control.

## Examples

All examples below are copy-paste-ready for the `STUDENT AREA` at the top of `sketch.js`.

### Beginner starter

Automatic collisions and engine-managed scoring (recommended for absolute beginners):

```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: false });
  game.setPaddleColors("red", "blue");
  game.setPaddleSpeed(5);
  game.setBallSpeed(4);
  // Enable engine-managed scoring for a simple game flow
  game.setupScoring();
}

function draw() {
  background(0);
  game.update();
  game.show();
}
```

### Paddles positions & colours

Use this to show how to place paddles and make them visible:

```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame();
  game.setManualCollision(false);
  game.setupScoring();
  game.setLeftPaddle(30, height / 2 - 25);
  game.setRightPaddle(width - 40, height / 2 - 25);
  game.setPaddleColors("orange", "cyan");
  game.setPaddleSpeed(6);
}

function draw() {
  background(0);
  game.update();
  game.show();
}
```

### Manual collision (students implement bouncing)

Turn off engine auto-collisions and implement collision detection yourself:

```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: true });
  game.setPaddleColors("orange", "cyan");
  game.setPaddleSpeed(5);
}

function draw() {
  background(0);
  game.update();
  game.show();

  const ph = game.checkPaddleHit();
  if (ph === "left") {
    game.reflectFromPaddle("left", game.ballY);
    game.ballX = game.paddle1X + game.paddleW + game.ballRadius + 1;
  } else if (ph === "right") {
    game.reflectFromPaddle("right", game.ballY);
    game.ballX = game.paddle2X - game.ballRadius - 1;
  }

  const wh = game.checkWallHit();
  if (wh === "top" || wh === "bottom") {
    game.bounceVertical();
    if (wh === "top") game.ballY = game.ballRadius + 1;
    else game.ballY = height - game.ballRadius - 1;
  }
}
```

### Manual scoring (example)

When running manual collision exercises you can still keep score. Call the helper methods to increment scores without resetting the ball:

```javascript
function draw() {
  background(0);
  game.update();
  game.show();

  const wall = game.checkWallHit();
  if (wall === "left") {
    // right player scored
    game.player2Scored();
    // optionally: game.resetBall();
  } else if (wall === "right") {
    game.player1Scored();
    // optionally: game.resetBall();
  }
}
```

The engine will draw scores in `game.show()` whenever `game.scoringEnabled` is true or when scores are non-zero.

## Short API reference

- `new PongGame({ manualCollision: true|false })` — construct the engine; setting `manualCollision:true` disables automatic collisions.
- `game.setManualCollision(enabled)` — toggle manual/automatic collisions at runtime.
- `game.setupScoring()` — initialise engine-managed scoring (no-op in manual mode).
- `game.setScoringEnabled(enabled)` — set scoring on/off (respects manualCollision).
- `game.player1Scored()` / `game.player2Scored()` — increment scores manually (do NOT reset the ball).
- `game.score1` / `game.score2` — numeric score values maintained by the engine.
- `game.checkPaddleHit()`, `game.checkWallHit()`, `game.resetBall()`, `game.reflectFromPaddle(side, contactY)`, `game.setPaddleSpeed(...)`, `game.setBallSpeed(...)`, `game.setPaddleColors(...)`, `game.setLeftPaddle(x,y)`, `game.setRightPaddle(x,y)`, `game.setPaddlesXY(...)`

## Notes & tips

- `game` is created in `sketch.js` inside `setup()` — don't call its methods before `setup()` runs.
- For beginner lessons use the constructor option `new PongGame({ manualCollision:false })` and `game.setupScoring()` so students get an immediately playable game with scoring.
- Use manual mode (`manualCollision:true`) when teaching collision geometry — it leaves the ball in-play and gives students a clearer view of contact -> reflection.

If you'd like, I can also add a printable handout layout or an on-screen toggle for scoring/reset in `sketch.js` for classroom demos.
// To let the engine manage scoring automatically, call `game.setupScoring()` in `setup()`
// (only when `manualCollision` is false). The engine will increment `game.score1`
// / `game.score2` and reset the ball when a point is scored. Example display:

# pong_lab

Simple Pong teaching lab built with p5.js. The repo contains a small, student-editable `sketch.js` and the game engine in `pong_game.js`.

## Quick run

Open `index.html` in a browser, or serve the folder and visit the local server address. Example (from project root):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The page loads p5.js and `sketch.js`. The `PongGame` class is defined in `pong_game.js` and is available to the sketch as the global `game` variable after `setup()` runs.

// Manual-focused variant: constructs the game with manual collision enabled
// so students can practice detecting collisions themselves. If you want
// the automatic collisions instead, use the other beginner block.
function setup() {
createCanvas(400, 300);

// Primary for manual lesson: start in manual mode
game = new PongGame({ manualCollision: true });

// Make the paddles easier to see and control
game.setPaddleColors("red", "blue"); // left is red, right is blue
game.setPaddleSpeed(5); // how fast the paddles move with keys
game.setBallSpeed(4); // how fast the ball moves overall
}

- Set both paddles' X,Y coordinates. Values are constrained to keep paddles fully on-screen.

- setLeftPaddle(x, y)

  - Set left paddle (player 1) X,Y.

- setRightPaddle(x, y)

  - Set right paddle (player 2) X,Y.

- setPaddleColors(left, right)

  - Set paddle colours (US spelling). Accepts any input supported by p5's `color()`.

- setBallSpeed(speed)

  - Set the ball's speed magnitude (preserves direction signs).

- setPaddleSpeed(speed)

  - Set how fast paddles move in pixels per frame when keys are pressed.

- setPaddleCollisionEnabled(enabled)

  - Enable or disable automatic paddle collision handling (pass true/false).

- setWallBounceEnabled(enabled)

  - Enable or disable automatic top/bottom wall bounce (pass true/false).

- checkPaddleHit()

  - Returns which paddle (if any) the ball is currently colliding with: "left", "right", or "none".

- checkWallHit()

  - Returns which wall (if any) the ball has touched: "top", "bottom", "left", "right", or "none".

- resetBall()

  - Reset the ball to the center and reverse its X direction.

- setupScoring()

  - Initialise engine scoring and reset the ball to start a game. Call this from your sketch's `setup()` when you want the engine to track points and automatically reset the ball after a score. If the engine is in `manualCollision` mode, `setupScoring()` is a no-op and scoring remains disabled.

- setScoringEnabled(enabled)

  - Toggle scoring at runtime. Passing `true` turns scoring on (unless `manualCollision` is enabled), `false` turns it off.

- scoringEnabled (property)

  - Read-only-ish boolean (on the `game` instance) indicating whether scoring is currently enabled.

- score1 / score2 (properties)

  - When scoring is enabled, the engine maintains `game.score1` (left player) and `game.score2` (right player). Use these to display the score in your sketch.

- player1Scored() / player2Scored()

  - Call these from your sketch when you are handling collisions or scoring manually (for example in `manualCollision` mode). They increment the appropriate player's score but do NOT reset the ball — this gives students control over what happens after a point during experiments. The engine's automatic scoring path will still reset the ball when a point occurs.

- bounceHorizontal()

  - Invert the ball's X velocity (for left/right reflections).

- bounceVertical()

  - Invert the ball's Y velocity (for top/bottom reflections).

- bounceFrom(hit)

  - Convenience: bounce based on descriptor strings like "top", "bottom", "left", "right", or "paddle".

- reflectFromPaddle(side, contactY)
  - Pong-style reflection: set ball velocity based on where it contacted the paddle. `side` is 'left' or 'right' (or 1/2), `contactY` is the Y coordinate of the hit (for example, `game.ballY`).

All method names are synchronous and operate on the `game` instance created in `setup()`.

## Example usage

Inside the `STUDENT AREA` of `sketch.js` (or from the browser console after the sketch starts):

```javascript
// Set paddle colours and speed
game.setPaddleColors("red", "blue");
game.setPaddleSpeed(6);

// Move left paddle to (20,50) and right paddle to (380,150)
game.setLeftPaddle(20, 50);
game.setRightPaddle(380, 150);

// Make the ball faster
game.setBallSpeed(5);

// Turn off engine paddle collision so students can implement custom logic
game.setPaddleCollisionEnabled(false);

// To use engine-managed scoring, call `game.setupScoring()` in `setup()`
// (only when `manualCollision` is false). The engine will increment scores
// and reset the ball after a point. In `draw()` you can display the scores:
if (game.scoringEnabled) {
  text(game.score1 || 0, width / 4, 30);
  text(game.score2 || 0, (width * 3) / 4, 30);
}
```

## Notes & tips

- `game` is created in `sketch.js` inside `setup()` — don't call its methods before `setup()` runs.
- If you prefer offline usage, update `index.html` to load the local `p5.js` and `p5.sound.min.js` files (they're included in the repo) instead of the CDN.
- The engine intentionally exposes a small, focused API so students can experiment without needing to modify engine internals.

If you'd like, I can also add a short section with running examples, or generate a small interactive UI to toggle collision/wall-bounce and reset scores.

## Manual collision: constructor option vs setter

There are two equivalent ways to tell the engine you will handle collisions yourself:

- At construction time: pass `{ manualCollision: true }` to the constructor.

```javascript
// option A: constructor-time (disables engine auto-collisions)
// Primary pattern shown here: construct with the option
game = new PongGame({ manualCollision: true });
```

- Or after creating the instance: call `setManualCollision(true)`.

```javascript
// option B: set after construction (does the same thing)
// Alternative pattern: construct normally then call the setter
game = new PongGame();
game.setManualCollision(true);
```

Use whichever feels clearer for your lesson — both stop the engine from auto-bouncing the ball so you can detect hits and call the helpers yourself.

Teacher tip: for beginners, teach the constructor option first (it's a single place to show the mode), then show the setter for runtime toggling.

## Toggle manual/automatic collisions at runtime (demo snippet)

If you want students to switch modes while the sketch runs (demo or lesson), add this tiny `keyPressed()` handler to the STUDENT AREA. Press `M` to toggle between manual and automatic collision modes:

```javascript
function keyPressed() {
  if (key === "m" || key === "M") {
    game.setManualCollision(!game.manualCollision);
  }
}
```

This demonstrates how the setter can be used for live demos.

Teaching note — when to introduce manual collisions

Introduce manual collision handling after students have played the basic game for a few minutes and are comfortable with:

- moving paddles (W/S and Up/Down),
- noticing how the ball bounces, and
- changing simple numbers like `setPaddleSpeed()` and `setBallSpeed()`.

Once they can predict how the ball moves, manual collisions are a good hands-on exercise: students can see how changing the contact point changes the bounce angle.

## Beginner copy-paste starter (for absolute beginners)

If you're new to JavaScript, here is the simplest code you can copy and paste into the `STUDENT AREA` at the top of `sketch.js`. It does three things:

- creates the game area,
- starts the engine, and
- changes the paddle colours and speeds so it's easier to see and play.

Copy the whole block below into the top of `sketch.js` (replace whatever is in the STUDENT AREA) and then open `index.html` in your browser.

```javascript
// === BEGINNER: copy this into the STUDENT AREA of sketch.js ===
// Don't worry about the other code — this is all you need to try the game.

// Keep engine collisions on so the game works automatically
// (use the API `setManualCollision` on the `game` instance)

function setup() {
  // Make the game window (do not change these numbers yet)
  createCanvas(400, 300);

  // Start the Pong engine — the variable `game` is used by the code below
  // Primary pattern for beginners: construct with the manualCollision option
  game = new PongGame({ manualCollision: false });
  // Alternative: construct normally then call the setter
  // game = new PongGame();
  // game.setManualCollision(false);

  // Make the paddles easier to see and control
  game.setPaddleColors("red", "blue"); // left is red, right is blue
  game.setPaddleSpeed(5); // how fast the paddles move with keys
  game.setBallSpeed(4); // how fast the ball moves overall
  // Initialise engine scoring for this beginner automatic-collision example
  game.setupScoring();
  // (Constructor above already set manualCollision=false) but calling the
  // setter here is also fine if you prefer the setter pattern.
  // game.setManualCollision(false);
  // Alternatively, construct with manualCollision disabled explicitly:
  // game = new PongGame({ manualCollision: false });
}

function draw() {
  // Clear screen and run the game loop (this is required)
  background(0);
  game.update();
  game.show();
}

// Now open index.html and play: use W/S to move the left paddle, and
// the Up/Down arrow keys to move the right paddle.
// === END COPY ===
```

## Example: set paddle positions and colours

This example shows how to set each paddle's X and Y position and change their colours. It's also copy-paste-ready for the `STUDENT AREA` at the top of `sketch.js`.

Copy the block below into the `STUDENT AREA` (replace whatever is there). It places the paddles near the left/right edges and gives them bright colours so they're easy to see.

```javascript
// === PADDLES POSITIONS & COLOURS: copy into the STUDENT AREA ===
// This sets where each paddle appears and what colour they are.

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

  // Ensure automatic collisions are turned on for this example
  game.setManualCollision(false);

  // Initialise engine-managed scoring for this example
  game.setupScoring();

  // Place left paddle (x, y). y is measured from top of the screen.
  // height/2 - 25 roughly centres the paddle vertically.
  game.setLeftPaddle(30, height / 2 - 25);

  // Place right paddle (x, y). width - 40 keeps it near the right edge.
  game.setRightPaddle(width - 40, height / 2 - 25);

  // Make the paddles stand out
  game.setPaddleColors("orange", "cyan"); // left = orange, right = cyan

  // Make paddles a little quicker to move
  game.setPaddleSpeed(6);
}

function draw() {
  // Runs each frame: clear the screen and draw the game
  background(0);
  game.update();
  game.show();
}

// Now open index.html and play. Use W/S for the left paddle and
// Up/Down arrows for the right paddle.
// === END COPY ===
```

## Example: manual collision handling (see how bouncing works)

This example shows how to turn off the engine's automatic collisions and detect hits yourself. It's helpful if you want to learn how collisions and bouncing work.

Copy the whole block below into the `STUDENT AREA` at the top of `sketch.js`.

```javascript
// === MANUAL COLLISION: copy into the STUDENT AREA ===
// This example shows how to turn off the engine's automatic collisions
// and handle collisions yourself using the engine helpers.

function setup() {
  createCanvas(400, 300);
  // Option A: construct then call the setter
  game = new PongGame();
  game.setManualCollision(true);
  // Option B (alternative): construct with the option directly
  // game = new PongGame({ manualCollision: true });

  // Make paddles visible and easy to move
  game.setPaddleColors("orange", "cyan");
  game.setPaddleSpeed(5);
}

function draw() {
  // Run engine movement and drawing (it won't auto-bounce now)
  background(0);
  game.update();
  game.show();

  // MANUAL COLLISION DETECTION
  // 1) Paddle hits: checkPaddleHit() returns 'left','right' or 'none'
  const ph = game.checkPaddleHit();
  if (ph === "left") {
    // reflect with angle based on where the ball hit the paddle
    game.reflectFromPaddle("left", game.ballY);
    // nudge ball out so we don't immediately detect the same collision
    game.ballX = game.paddle1X + game.paddleW + game.ballRadius + 1;
  } else if (ph === "right") {
    game.reflectFromPaddle("right", game.ballY);
    game.ballX = game.paddle2X - game.ballRadius - 1;
  }

  // 2) Top/bottom walls: checkWallHit() returns 'top' or 'bottom' when hit
  const wh = game.checkWallHit();
  if (wh === "top" || wh === "bottom") {
    game.bounceVertical();
    if (wh === "top") game.ballY = game.ballRadius + 1;
    else game.ballY = height - game.ballRadius - 1;
  }
}

// Now open index.html and try the game. Use W/S (left) and Up/Down (right).
// === END COPY ===
```

### Manual scoring (example)

When you run the manual collision example (`manualCollision: true`) the engine will not
manage scoring or reset the ball. If you'd like to keep score while students experiment
you can call `game.player1Scored()` and `game.player2Scored()` from your sketch code.
The engine's `show()` will render the scores automatically whenever they are non-zero.

Copy this short block into the `STUDENT AREA` to try manual scoring:

```javascript
// Manual scoring + manual collisions example
function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: true });
  game.setPaddleColors("orange", "cyan");
  game.setPaddleSpeed(5);
  // Do NOT call game.setupScoring() here — scoring is disabled in manual mode.
}

function draw() {
  background(0);
  game.update();
  game.show();

  // Detect left/right exits and increment the appropriate player's score.
  // These helper calls increment the score but do NOT reset the ball so
  // students can keep experimenting with the same ball position.
  const wall = game.checkWallHit();
  if (wall === "left") {
    // Right player scored
    game.player2Scored();
    // Optionally reset the ball yourself if you want a serve:
    // game.resetBall();
  } else if (wall === "right") {
    // Left player scored
    game.player1Scored();
    // game.resetBall();
  }
}
```
