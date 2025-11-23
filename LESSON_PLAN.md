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

5. (optional, 1 min) Quick reflection

- Ask students to share one observation: e.g., "When the ball hits higher, it goes up/down faster" or "I made the paddles faster and it's easier to block the ball."

Extensions / follow-ups

- Ask students to implement a simple scoring change (increase speed on every 3 points).
- Have them add a visual flash on the paddle when collision is detected (change paddle colour for a frame).

Notes for teachers

- If students are brand-new to JS, do the automatic starter first (constructor with `manualCollision:false`) so they get a working game immediately.
- Use the manual-focused variant after they have played and can predict basic movement; it teaches collision geometry (contact point -> bounce angle).

Ready-to-copy checklist for the teacher

- Open `index.html` in the browser.
- Paste beginner starter into STUDENT AREA, run.
- Paste manual collision example, run, and demo toggling.
