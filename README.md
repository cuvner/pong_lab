<<<<<<< ours
# Pong Lab

A lightweight p5.js Pong sandbox that now runs on a minimal static backend. All assets are served directly from this repository with p5.js loaded via CDN, so you only need a simple HTTP server to host the files locally.

## Project layout
- `index.html` – loads p5.js from the CDN and wires the sketch and styles.
- `sketch.js` – contains the Pong game engine plus the student-facing scoring logic.
- `style.css` – basic page styling (feel free to extend).
- `p5.js` / `p5.sound.min.js` – CDN fallbacks for offline use.

## Running the app
1. From the project root, start a static server (Python example):
   ```bash
   python -m http.server 8080
   ```
2. Open `http://localhost:8080/` in your browser.
3. Use `W/S` for the left paddle and the `Up/Down` arrows for the right paddle.

No additional build tooling or package installation is required because the new backend is simply static file serving.

## Customizing
- Adjust paddle and ball behavior in the student section at the top of `sketch.js`.
- Toggle built-in collisions with `game.disablePaddleCollision()` or wall bounces with `game.disableWallBounce()`.
- Update colors via `game.setPaddleColours()` or tweak speeds with `setBallSpeed()` and `setPaddleSpeed()`.
=======
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
    // engine can infer the contact Y from its internal ball position
    // and will nudge the ball out of the paddle automatically, so you
    // don't need to set `game.ballX` yourself.
    game.reflectFromPaddle("left");
  } else if (ph === "right") {
    game.reflectFromPaddle("right");
  }

  // Top/bottom wall bounces are handled by the engine automatically even
  // when `manualCollision:true` is set — students don't need to implement
  // these checks or nudge the ball themselves.
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

### Easier manual-collision for younger students

If manual collision is too verbose for your class, use the engine's assisted helpers so students don't need to write detection math. Two helpers are available:

- `game.manualCollisionAssist()` — call this inside `draw()` when `manualCollision:true`. It will detect paddle and wall hits, apply the engine's reflection helpers, nudge the ball out of paddles to avoid repeated triggers, and return `{ hit, contactFraction }` where `contactFraction` is -1..+1 (top..bottom) for paddle hits.

- `game.simpleCollisionStep({ autoScore, autoReset })` — a single-call helper that runs the assisted collision step and optionally handles scoring/reset when `autoScore` is true. It returns `{ hit, contactFraction, scored }`.

Example assisted usage (copy into STUDENT AREA when using `manualCollision:true`):

```javascript
function draw() {
  background(0);
  game.update();
  // Assisted collisions for beginners — safe and simple
  const res = game.manualCollisionAssist();
  // res.hit is 'left'|'right'|'top'|'bottom'|'none'
  // res.contactFraction is -1..+1 for paddle hits
  game.show();
}
```

Or, for one-call collision+scoring handling:

```javascript
function draw() {
  background(0);
  game.update();
  const out = game.simpleCollisionStep({ autoScore: true });
  // out.scored === 'left'|'right' if a point was auto-scored
  game.show();
}
```

### One-line student example (very simple)

Give beginners a single easy line to copy into `draw()` that reacts to paddle hits:

```javascript
if (game.paddleHit === "left") {
  game.bounceRight();
  game.clearPaddleHit();
}
```

If you'd rather avoid having students remember to clear the event, use the consume pattern:

```javascript
const hit = game.consumePaddleHit();
if (hit === "left") game.bounceRight();
```

Teacher note: prefer `consumePaddleHit()` in group exercises — it guarantees the event is cleared and avoids duplicate reactions if students forget to call `clearPaddleHit()`.

## Short API reference

The `PongGame` class exposes a small set of student-friendly helpers. Key points for teachers:

- The constructor accepts `{ manualCollision: true|false }`. When `manualCollision:true` is set the engine **disables automatic paddle collisions** so students can handle them manually. Top/bottom wall bounce is always handled by the engine.
- Keyboard input is built in (W/S for the left paddle, Up/Down for the right paddle). Students do not need to wire listeners.
- The engine exposes two simple state flags you can read inside `draw()`: `game.paddleHit` (`"left"|"right"|"none"`) and `game.wallHit` (`"left"|"right"|"top"|"bottom"|"none"`).

Public API (classroom-safe methods)

- **Game setup & options**
  - `new PongGame({ manualCollision })` — construct the engine with optional manual collision mode.
  - `game.setManualCollision(enabled)` — toggle manual/automatic paddle collisions at runtime.
  - `game.setPaddleCollisionEnabled(enabled)` / `game.setWallBounceEnabled(enabled)` — turn engine collision handling on/off.
- **Scoring**
  - `game.setupScoring()` — initialise engine-managed scoring (no-op in manual mode) and reset the ball.
  - `game.setScoringEnabled(enabled)` — enable/disable engine scoring. Resets scores to 0 when enabled.
  - `game.player1Scored()` / `game.player2Scored()` — increment scores manually without resetting the ball.
  - `game.consumeWallHit()` — one-shot helper for manual scoring; returns `"left"|"right"|"none"` and prevents repeat reports until the ball re-enters play.
- **Movement & appearance**
  - `game.setLeftPaddle(x, y)` / `game.setRightPaddle(x, y)` — move each paddle within the canvas.
  - `game.setPaddleColors(left, right)` — set paddle colours.
  - `game.setPaddleSpeed(n)` / `game.setBallSpeed(n)` — adjust movement speeds while preserving direction.
- **Collision helpers**
  - `game.checkPaddleHit()` — returns `"left"|"right"|"none"`.
  - `game.getPaddleContactFraction(side)` — returns a -1..+1 fraction for where the ball hit a paddle.
  - `game.checkWallHit()` — returns `"left"|"right"|"top"|"bottom"|"none"`.
  - `game.reflectFromPaddle(side[, contactY])` — reflect using the engine's ball position (nudges the ball clear automatically).
  - `game.manualCollisionAssist()` — helper for manual mode; detects hits, reflects, nudges, and returns `{ hit, contactFraction }`.
  - `game.simpleCollisionStep({ autoScore, autoReset })` — single call to run assisted collisions and optional scoring.
- **Bounce helpers & events**
  - `game.bounceHorizontal()` / `game.bounceVertical()` — flip directions.
  - `game.bounceRight()` / `game.bounceLeft()` / `game.bounceTop()` / `game.bounceBottom()` — force the next movement to go in that direction while keeping speed.
  - `game.bounceFrom(descriptor)` — accepts `"left"|"right"|"top"|"bottom"|"paddle"|"horizontal"|"vertical"`.
  - `game.consumePaddleHit()` / `game.clearPaddleHit()` — read-and-clear or clear the `paddleHit` event flag.
- **Other helpers**
  - `game.resetBall()` — recentre the ball and reverse X direction.
  - `game.update()` / `game.show()` — run each frame to update physics and draw the scene.

# pong_lab — teacher quickstart

This is a tiny Pong teaching lab built with p5.js. The engine is in `pong_game.js` and students edit the `STUDENT AREA` at the top of `sketch.js`.

Quick goals for teachers

- Run the sketches in a browser and let students edit the top of `sketch.js`.
- Use `manualCollision:true` to teach collision geometry (students handle paddle hits).
- Keep top/bottom wall bounces and basic scoring handled by the engine so lessons stay simple.

Run locally

1. From the repo folder run:

```bash
python3 -m http.server 8000
# Open http://localhost:8000 in a browser
```

Simple copy-paste examples (put these in the STUDENT AREA in `sketch.js`)

Beginner: automatic collisions + scoring (recommended first)

```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: false });
  game.setPaddleColors("red", "blue");
  game.setPaddleSpeed(5);
  game.setBallSpeed(4);
  game.setupScoring(); // engine will track points and reset on score
}

function draw() {
  background(0);
  game.update();
  game.show();
}
```

Manual: students implement paddle collisions (walls still auto-handled)

```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame({ manualCollision: true });
  game.setPaddleColors("orange", "cyan");
}

function draw() {
  background(0);
  game.update();
  game.show();

  const ph = game.checkPaddleHit();
  if (ph === "left") game.reflectFromPaddle("left");
  else if (ph === "right") game.reflectFromPaddle("right");
}
```

Notes for teachers

- `game.reflectFromPaddle(side)` uses the engine's ball position if you omit the hit Y and will nudge the ball out of the paddle for you.
- Top/bottom walls are handled by the engine in all modes — students don't need to implement wall bounces.
- To manually increment scores in `manualCollision` mode use `game.player1Scored()` / `game.player2Scored()` (these do NOT reset the ball).

Common tweaks students try

```javascript
// Move paddles
game.setLeftPaddle(x, y);
game.setRightPaddle(x, y);

// Change appearance/speed
game.setPaddleColors("cyan", "magenta");
game.setPaddleSpeed(6);
game.setBallSpeed(5);

// Toggle manual collision at runtime
game.setManualCollision(true); // or false
```

One-line student example (easy copy/paste)

```javascript
const hit = game.consumePaddleHit();
if (hit === "left") game.bounceRight();
```

Short API (most useful methods)

- `new PongGame({ manualCollision: true|false })`
- `game.setManualCollision(enabled)`
- `game.setupScoring()`
- `game.player1Scored()` / `game.player2Scored()`
- `game.setLeftPaddle(x,y)` / `game.setRightPaddle(x,y)`
- `game.setPaddleColors(left, right)`
- `game.setPaddleSpeed(n)` / `game.setBallSpeed(n)`
- `game.checkPaddleHit()` / `game.checkWallHit()`
- `game.reflectFromPaddle(side[, contactY])` (contactY optional)
- `game.consumePaddleHit()` / `game.clearPaddleHit()`

If you'd like, I can produce a one-page printable handout for teachers or add an on-screen helper in the sketches.
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

````

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
````

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
>>>>>>> theirs
