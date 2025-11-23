# Lesson Plan — 10 minute intro (teacher notes)

Goal

- Give students a short, hands-on activity to run a working Pong sketch and (optionally) try manual paddle collisions.

Timing (10 minutes)

- 1 min: open the sketch and confirm canvas is visible
- 3 min: run the automatic starter and play
- 4–5 min: switch to manual collision example (optional) and explore
- 1 min: quick reflection and wrap-up

Quick flow for the teacher

1. Open `index.html` in a browser (or serve the folder):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

2. Paste the beginner starter (automatic collisions) into the STUDENT AREA and run.
3. After a few minutes, show the manual example and explain contact -> reflection.

Starter code to paste (automatic collisions)

```js
let game = new PongGame({ manualCollision: false });
game.setupScoring();
function draw() {
  background(0);
  game.update();
  game.show();
}
```

Manual example to paste (optional)

```js
let game = new PongGame({ manualCollision: true });
function draw() {
  background(0);
  game.update();
  game.show();
  const ph = game.checkPaddleHit();
  if (ph === "left") game.reflectFromPaddle("left");
  else if (ph === "right") game.reflectFromPaddle("right");
}
```

Teacher notes — things to highlight

- `reflectFromPaddle(side)` accepts an optional contactY; if omitted it uses the engine's ball position and will nudge the ball out of the paddle.
- Top/bottom wall bounces remain handled by the engine in all modes — students don't need to implement wall logic.
- `manualCollision:true` disables paddle collisions only (so students can experiment with paddle geometry); scoring is disabled in manual mode unless students call `game.player1Scored()` / `game.player2Scored()`.
- Use `consumePaddleHit()` in whole-class demos to avoid double-handling events.
- Assisted helper for younger classes: `manualCollisionAssist()` runs hit detection, reflection, and nudging for you in manual mode. Use this when students aren't ready to write collision math.

Quick copy-paste tweaks to show students

```js
// Move paddles
game.setLeftPaddle(30, height / 2 - 25);
game.setRightPaddle(width - 40, height / 2 - 25);

// Appearance & speed
game.setPaddleColors("cyan", "magenta");
game.setPaddleSpeed(6);
game.setBallSpeed(4);
```

Wrap-up prompts

- What happened when you hit the top or bottom of a paddle?
- How did changing paddle speed affect play?

If you'd like a printable one-page handout or a short slide to copy into a lesson deck, I can generate that next.
Lesson plan: 5–10 minute intro — Pong manual collisions

Goal

Give students a short, hands-on activity where they:

- run a working Pong sketch,
- see how collisions are detected, and
- change the collision behavior manually using the engine helpers.

Prerequisites

- Students can open `index.html` in a browser (or teacher runs a simple static server).
- They can edit the `STUDENT AREA` at the top of `sketch.js` and paste code.
- Controls: W/S for left paddle, Up/Down for right paddle.

Materials

- The `pong_lab` project (files in the repo), a browser, and optionally a projector.

Timing & steps (5–10 minutes)

1. (1 min) Setup & run

- Ask students to open `index.html` (or teacher: serve the folder and show it).
- Confirm everyone sees the canvas.

2. (1–2 min) Starter paste

- Students paste the "BEGINNER" starter from `README.md` into the STUDENT AREA and save.
- If doing the manual-focused version, paste the manual starter (it constructs `PongGame({ manualCollision: true })`).
- Run/refresh so the sketch starts.

3. (1–2 min) Play & observe

- Students play a minute and notice how the paddles and ball move and bounce.
- Teacher asks: "Where does the ball bounce? What changes when you move the paddle?"

4. (2–3 min) Manual collision exercise

- Paste the "MANUAL COLLISION" example into the STUDENT AREA (or switch to manual in the sketch).
- Students run and test: now the code in `draw()` checks for `checkPaddleHit()` and calls `reflectFromPaddle()`; they can tweak the paddle position or `setPaddleSpeed()` and observe changes.
- Teacher prompt: "Try hitting the top of the paddle — what happens to the ball angle? Try the bottom — how is it different?"
- Note: when using the manual collision example (`manualCollision: true`) the engine will NOT manage scoring and will NOT reset the ball automatically; this keeps the ball in-play for students experimenting with collision behaviour.
  - Note: when using the manual collision example (`manualCollision: true`) the engine will NOT manage scoring and will NOT reset the ball automatically; this keeps the ball in-play for students experimenting with collision behaviour.
  - If you want to keep score during manual exercises, call `game.player1Scored()` or `game.player2Scored()` from your student code when you detect a point. The engine's `show()` will draw the scores whenever they are non-zero so students can display them without extra drawing code.

5. (optional, 1 min) Quick reflection

- Ask students to share one observation: e.g., "When the ball hits higher, it goes up/down faster" or "I made the paddles faster and it's easier to block the ball."

Extensions / follow-ups

- Ask students to implement a simple scoring change (increase speed on every 3 points).
- Have them add a visual flash on the paddle when collision is detected (change paddle colour for a frame).

Notes for teachers

- If students are brand-new to JS, do the automatic starter first (constructor with `manualCollision:false`) so they get a working game immediately.
- Use the manual-focused variant after they have played and can predict basic movement; it teaches collision geometry (contact point -> bounce angle).

- Teacher tip (when to introduce the one-line helper)

  - For 12–13 year olds: start with the automatic starter so everyone gets a working game. After 3–5 minutes of play, introduce the one-line helper (`if (game.paddleHit === 'left') { game.bounceRight(); game.clearPaddleHit(); }`) as a gentle step toward manual collision. Use `game.consumePaddleHit()` when running whole-class exercises so students don't need to remember to clear the event.
  - Teacher tip: the `reflectFromPaddle(side, contactY)` helper now accepts just the `side` (for example `game.reflectFromPaddle('left')`) — the engine will use its current ball position if you omit `contactY`. This makes the helper simpler for students to call during manual-collision exercises.
  - Small implementation note for teachers: `reflectFromPaddle()` also nudges the ball slightly out of the paddle after reflecting, matching the behaviour of the `manualCollisionAssist()` helper. This means students don't need to set `game.ballX` themselves after calling the helper — it's handled by the engine to reduce accidental double-triggers in classroom exercises.

Ready-to-copy checklist for the teacher

- Open `index.html` in the browser.
- Paste beginner starter into STUDENT AREA, run.
- Paste manual collision example, run, and demo toggling.
