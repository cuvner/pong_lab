# pong_lab

Simple Pong teaching lab built with p5.js. The repo contains a small, student-editable `sketch.js` and the game engine in `pong_game.js`.

## Quick run

Open `index.html` in a browser, or serve the folder and visit the local server address. Example (from project root):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The page loads p5.js and `sketch.js`. The `PongGame` class is defined in `pong_game.js` and is available to the sketch as the global `game` variable after `setup()` runs.

## Controls

- Left paddle: W (up) / S (down)
- Right paddle: ↑ / ↓

## Purpose

Students should edit the top section of `sketch.js` (marked "STUDENT AREA") to experiment with game settings and call methods on the `game` object. The engine implementation in `pong_game.js` is intended to remain unchanged.

## Available API (PongGame public methods)

All of these are methods on the `game` instance (an instance of `PongGame`). You can call them from the student area in `sketch.js`, from browser console (after `setup()`), or from other scripts loaded after `pong_game.js`.

### Public API (preferred names)

The engine exposes a small, stable API — these are the preferred method names to use in new code and examples.

- setPaddlesXY(p1X, p1Y, p2X, p2Y)

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
let manualCollisionExample = false;

function setup() {
  // Make the game window (do not change these numbers yet)
  createCanvas(400, 300);

  // Start the Pong engine — the variable `game` is used by the code below
  game = new PongGame();

  // Make the paddles easier to see and control
  game.setPaddleColors("red", "blue"); // left is red, right is blue
  game.setPaddleSpeed(5); // how fast the paddles move with keys
  game.setBallSpeed(4); // how fast the ball moves overall
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
let manualCollisionExample = false; // keep engine collisions on for a working game

function setup() {
  createCanvas(400, 300);
  game = new PongGame();

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
