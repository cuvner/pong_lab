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
game.setPaddlesXY(30, height / 2 - 40, width - 40, height / 2 - 40);
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
let game = new PongGame({ manualCollision: true });

function draw() {
  background(30);

  // Let the engine update its ball position (but don't auto-bounce)
  game.update();

  // Check for a paddle hit; if detected, reflect the ball
  if (game.checkPaddleHit()) {
    // reflectFromPaddle expects (side, contactY)
    // side is 'left' or 'right' (string) — the helper returns these for you
    // contactY is the y-coordinate of where the ball hit the paddle
    const hit = game._lastPaddleHit; // engine sets this when checkPaddleHit() is true
    // convenience helper to reflect the ball using paddle contact point
    game.reflectFromPaddle(hit.side, hit.contactY);
  }

  // walls are still handled by the engine (or you can check them manually)
  game.show();
}
```

- Hints:
  - If `game.checkPaddleHit()` returns true, the engine records a small `game._lastPaddleHit` object with `{ side, contactY }`.
  - `reflectFromPaddle(side, contactY)` adjusts ball angle based on where it hit the paddle.

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
game.setPaddlesXY(30, height / 2 - 40, width - 40, height / 2 - 40);
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
