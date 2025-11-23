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

// Check for scoring in the draw() loop
if (game.checkWallHit() === "left") {
  // right player scored
  game.resetBall();
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
