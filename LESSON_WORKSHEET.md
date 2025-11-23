## Pong Lab — Student Worksheet (simple)

Estimated time: 15–30 minutes. Copy the short examples into the STUDENT AREA at the top of `sketch.js`.

Setup (teacher)

- Serve the folder and open `index.html` in a browser:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Controls: W/S (left paddle), Up/Down (right paddle).

Starter (automatic collisions + scoring)

```js
// STUDENT AREA
let game = new PongGame({ manualCollision: false });
game.setupScoring();

function draw() {
  background(30);
  game.update();
  game.show();
}
```

Task 1 — Run & Observe (3–5 minutes)

- Paste the starter into the STUDENT AREA, save, refresh, and play. Notice bounces and paddle movement.

Task 2 — Change paddles & colours (5 minutes)

- After creating `game`, try these lines to move paddles and change colours:

```js
game.setLeftPaddle(30, height / 2 - 25);
game.setRightPaddle(width - 40, height / 2 - 25);
game.setPaddleColors("#66ccff", "#ffcc66");
```

Task 3 — Make paddles faster (3–5 minutes)

- Try:

```js
game.setPaddleSpeed(8);
```

Optional Task 4 — Manual collisions (10–12 minutes)

- Use this when teaching contact -> reflection. Note: top/bottom walls are still handled by the engine.

```js
let game = new PongGame({ manualCollision: true });

function draw() {
  background(30);
  game.update();
  game.show();

  const ph = game.checkPaddleHit();
  if (ph === "left") game.reflectFromPaddle("left");
  else if (ph === "right") game.reflectFromPaddle("right");
}
```

Shortcut for younger students: call `manualCollisionAssist()` inside `draw()` and let the engine detect hits and reflect the ball for you. For a single-call version that also handles scoring/resets when requested, use `simpleCollisionStep({ autoScore: true })`.

Notes

- `game.reflectFromPaddle(side)` will use the engine's current ball position if you omit the contact Y and will nudge the ball out of the paddle.
- Top/bottom wall bounces remain automatic so students don't need to implement wall logic.
- To increment scores in manual mode call `game.player1Scored()` / `game.player2Scored()` (these do not reset the ball).
- For manual scoring without double-counting a point, use `game.consumeWallHit()` which reports a left/right exit once until the ball comes back into play.

One-line example

```js
const hit = game.consumePaddleHit();
if (hit === "left") game.bounceRight();
```

Teacher hints

- Start with the automatic starter for novices, then switch to the manual example after a few minutes of play.
- Use `consumePaddleHit()` in group activities so events are cleared automatically.

Files edited in this worksheet

- `sketch.js` (student area)

---

If you want a printable one-page handout from this worksheet, tell me and I will create it.

## Pong Lab — 15–30 minute Student Worksheet

Estimated time: 15–30 minutes (pick a 15-minute quick run or expand to ~30 with the bonus challenge).

Purpose

- Give students a short guided set of coding steps that build familiarity with the `PongGame` engine: running the sketch, changing paddle settings, and (optionally) implementing manual collision handling.

Learning goals

- Run and edit a p5.js sketch in the repository.
- Read and use a small JavaScript API (`PongGame`).
- Observe how paddle contact affects the ball's bounce and experiment with simple physics.
- (Optional) Implement manual collision logic using helper methods.

Setup (teacher)

- Ensure `index.html` is open in a browser (or run a simple static server from the repo root).
- Confirm students can edit the STUDENT AREA at the top of `sketch.js` and save/refresh.
- Controls: W/S (left paddle), Up/Down (right paddle).

Starter code (paste this into the STUDENT AREA of `sketch.js`)

```js
// BEGIN STUDENT AREA
// Quick starter: construct the game and run it.
let game = new PongGame({ manualCollision: false });
// Initialise engine scoring for the basic automatic-collision setup
game.setupScoring();

function draw() {
  background(30);
  game.update();
  game.show();
}
// END STUDENT AREA
```

Tasks

Task 1 — Run & Observe (3–5 minutes)

- Paste the starter above into the STUDENT AREA, save, and refresh the page. Play for a minute and notice: where does the ball bounce? How do the paddles move?

Task 2 — Change paddle positions & colours (5 minutes)

- Goal: make the left paddle closer to the center and change colours so each paddle is easy to spot.
- Edit your STUDENT AREA to include these lines after constructing the game:

```js
game.setLeftPaddle(30, height / 2 - 40);
game.setRightPaddle(width - 40, height / 2 - 40);
game.setPaddleColors("#66ccff", "#ffcc66");
```

- Save and refresh. Did the paddles move? Can you still play comfortably?

Task 3 — Make paddles faster (3–5 minutes)

- Goal: change how quickly paddles move when you press keys.
- Add this line in the STUDENT AREA:

```js
game.setPaddleSpeed(8); // default is smaller — try 6, 8, 10 and compare
```

- Play a few rounds. What value makes it easier to block the ball? Too fast?

Task 4 — Manual collision (10–12 minutes) — optional but recommended for deeper understanding

- Goal: switch the sketch to manual collision and implement a simple collision check inside `draw()` so students touch the API directly.
- Replace the starter code with this pattern (paste into STUDENT AREA):

```js
// Note: when using manualCollision=true the engine will NOT manage scoring
// (scoring is disabled in manual mode), so you won't get automatic resets.
// If you want to keep a score while in manual mode, call `game.player1Scored()`
// or `game.player2Scored()` from your code when you detect a scoring event.
// The engine's `show()` method will display the scores for you even in
// manual mode (it draws scores whenever they are non-zero).
let game = new PongGame({ manualCollision: true });

function draw() {
  background(30);

  // Let the engine update its ball position (but don't auto-bounce)
  game.update();

  // Check for a paddle hit; if detected, reflect the ball.
  // The engine helper `reflectFromPaddle()` now accepts just the side
  // and will use the engine's internal ball Y when you omit the contactY.
  const ph = game.checkPaddleHit();
  if (ph === "left") {
    // reflectFromPaddle will also nudge the ball out of the paddle for you
    game.reflectFromPaddle("left");
  } else if (ph === "right") {
    game.reflectFromPaddle("right");
  }

  // Important: top/bottom wall bounces remain automatic even when
  // `manualCollision:true` — the engine will handle top/bottom wall bounces
  // and nudging so students don't need to implement wall logic.
  game.show();
}

// --- Short manual-scoring example for teachers/students ---
// If you want students to keep score while experimenting in manual mode,
// add the following small snippet to your STUDENT AREA. It increments the
// appropriate player's score but does not reset the ball (students can
// call `game.resetBall()` themselves when they want to serve).

/*
function draw() {
  background(30);
  game.update();
  game.show();

  const wall = game.checkWallHit();
  if (wall === 'left') {
    // right player scored
    game.player2Scored();
    // optionally: game.resetBall();
  } else if (wall === 'right') {
    // left player scored
    game.player1Scored();
    // optionally: game.resetBall();
  }
}
*/

// --- Very short one-line example for beginners ---
// Students can copy this into `draw()` to react to hits without math:
// if (game.paddleHit === 'left') { game.bounceRight(); game.clearPaddleHit(); }
// Or use the consume pattern:
// const hit = game.consumePaddleHit(); if (hit === 'left') game.bounceRight();
```

- Hints:
  - If `game.checkPaddleHit()` returns true, the engine records a small `game._lastPaddleHit` object with `{ side, contactY }`.
  - `reflectFromPaddle(side, contactY)` adjusts ball angle based on where it hit the paddle.
  - For younger students: instead of writing collision detection, call `game.manualCollisionAssist()` inside `draw()` — it will detect paddle/wall hits, reflect the ball using the engine helpers, and return `{ hit, contactFraction }`. This gives students an easier entry point while they experiment with paddle position, colours, and speeds.

Task 5 — Add a “serve” key (5 minutes)

- Goal: add a key to reset the ball to the center so students can practice specific serves.
- In the STUDENT AREA add:

```js
function keyPressed() {
  if (key === " ") {
    // space to serve/reset
    game.resetBall();
  }
}
```

- Try serving from different positions — does the ball head where you expect?

Bonus challenge (5–10 minutes)

- Change the reflection behaviour: when the ball hits the top half of a paddle, increase its vertical speed a little more. Try modifying `PongGame.reflectFromPaddle()` locally or calling `game.bounceFrom({ vx, vy })` if you compute new velocities.

Solutions & Hints (short)

- Task 2 solution example (complete student area):

```js
let game = new PongGame({ manualCollision: false });
game.setLeftPaddle(30, height / 2 - 40);
game.setRightPaddle(width - 40, height / 2 - 40);
game.setPaddleColors("#66ccff", "#ffcc66");
function draw() {
  background(30);
  game.update();
  game.show();
}
```

- Task 3: `game.setPaddleSpeed(8);` — test and iterate.

- Task 4 hint: if your `checkPaddleHit()` call doesn't appear to trigger, try logging `game._lastPaddleHit` after a hit to see the structure. If your engine version doesn't expose `_lastPaddleHit`, use `game._detectPaddleHit()` or consult the README for the exact helper name (some versions keep small internal properties — teacher note: show this first).

- Task 5: `game.resetBall()` returns the ball to the center and gives it a starting velocity.

Teacher notes & pacing tips

- For a 15-minute class: do Tasks 1–3 and Task 5. Skip manual collision (Task 4) unless students finish early.
- For a 25–30 minute class: include Task 4 and the bonus challenge.
- Pair students: one edits code while the other tests in the browser, then swap.

Assessment checklist (quick)

- Student can start the sketch and run it in a browser.
- Student changed paddle position or colour and saw a difference.
- Student altered paddle speed and observed effect.
- (Optional) Student implemented or ran manual collision logic and demonstrated the ball reflecting differently depending on contact point.

Files created/edited in this activity

- `sketch.js` (student area edits only)
- `LESSON_WORKSHEET.md` (this file — teacher/student copy)

Where to go next

- Add a scoring display or make the ball speed up over time. These are natural follow-ups.

Acknowledgements

- This worksheet uses the `PongGame` engine and helpers available in the repository. See `README.md` for the full API.
