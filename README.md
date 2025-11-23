# Pong Lab (p5.js Web Editor)

A classroom-friendly Pong sandbox built with p5.js. Everything runs in the p5.js Web Editor—no local server or downloads required.

## How to open the saved sketch

1. Go to [editor.p5js.org](https://editor.p5js.org/).
2. Open the pre-saved "Pong Lab" sketch shared by your teacher **or** make a new sketch and add two files:
   - `sketch.js` (student code – copy/paste from this repo)
   - `pong_game.js` (the game engine – copy/paste from this repo)
3. Press **Play** (triangle button). Use **W/S** for the left paddle and **Up/Down** for the right paddle.

## What students edit

Only change `sketch.js`, inside the **STUDENT AREA** at the top. The engine in `pong_game.js` stays as-is.

## Student methods at a glance

| Task | Method | What it does |
| --- | --- | --- |
| Create game | `game = new PongGame();` | Starts Pong with engine-handled collisions and scoring off by default. |
| Draw frame | `game.update();` then `game.show();` | Moves the ball, handles input, and draws everything. |
| Paddle position | `setLeftPaddle(x, y)`, `setRightPaddle(x, y)` | Move paddles anywhere inside the canvas. |
| Paddle look | `setPaddleColors(leftColor, rightColor)` | Change paddle colours. |
| Paddle speed | `setPaddleSpeed(speed)` | Change keyboard movement speed. |
| Turn on manual collision | `game.setManualCollision(true);` | Disables engine paddle bounces so you can code your own (walls still bounce). Set back to `false` to return to engine collisions. |
| Detect paddle hits | `checkPaddleHit()` or `consumePaddleHit()` | Returns `"left"`, `"right"`, or `"none"`. `consume` also clears the stored hit. |
| Reflect ball (manual) | `reflectFromPaddle(side[, contactY])` | Uses engine math to bounce when you detected a hit yourself. |
| Simple bounces | `bounceLeft()`, `bounceRight()`, `bounceTop()`, `bounceBottom()`, `bounceHorizontal()`, `bounceVertical()` | Force a new direction while keeping speed. |
| Read contact point | `getPaddleContactFraction(side)` | `-1` = top, `0` = center, `+1` = bottom of the paddle hit. |
| Scoring (engine) | `setupScoring()`, `setScoringEnabled(onOff)` | Turn on/off the built-in scoring system. |
| Scoring (manual) | `consumeWallHit()` | Detect which wall (`"left"`/`"right"`) the ball crossed so you can award points yourself. |
| Manual score bumps | `player1Scored()`, `player2Scored()` | Increase scores without resetting the ball. |
| Ball speed | `setBallSpeed(speed)`, `resetBall()` | Change ball speed or reset to the center. |
| Helper for manual mode | `manualCollisionAssist()` | Detects hits and reflects for you; returns `{ hit, contactFraction }`. Good training wheels. |

## Example: simplest playable game (engine collisions + scoring)
```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame();
  game.setPaddleColors("red", "blue");
  game.setPaddleSpeed(5);
  game.setBallSpeed(4);
  game.setupScoring();
}

function draw() {
  background(0);
  game.update();
  game.show();
}
```

## Example: detect goals and keep score yourself
```javascript
function setup() {
  createCanvas(400, 300);
  game = new PongGame();
  game.setManualCollision(false); // engine handles paddle bounces
}

function draw() {
  background(0);
  game.update();

  // Award points when the ball crosses a wall
  const wall = game.consumeWallHit();
  if (wall === "left") game.player2Scored();
  if (wall === "right") game.player1Scored();

  game.show();
}
```

## Example: manual paddle hits (you handle the bounce)
```javascript
let hit;

function setup() {
  createCanvas(400, 300);
  game = new PongGame();
  game.setManualCollision(true); // switch to manual AFTER creating the game
}

function draw() {
  background(0);
  game.update();

  // Check who got hit and bounce yourself
  hit = game.consumePaddleHit();
  if (hit === "left") game.reflectFromPaddle("left");
  if (hit === "right") game.reflectFromPaddle("right");

  game.show();
}
```

## Tips for teachers

- Start with the simplest example so everyone sees a working game immediately.
- When students are ready, toggle manual collisions with `game.setManualCollision(true);` and ask them to code the bounce.
- Use `manualCollisionAssist()` as a safety net for younger students—it auto-detects hits in manual mode while still letting them move paddles and track scores.
