let currentLevel = 1;
const MAX_LEVEL = 4;
let score = 0;
let wrongAttempts = 0;
const MAX_ATTEMPTS = 3;
let isGameOver = false;

let shapes = [];
let targets = [];
let walls = [];

let feedbackText = "";
let feedbackColor = null;
let feedbackTimer = 0;
let levelTransitionTimer = 0;

let audioCtx = null;

function setup() {
  createCanvas(950, 620);
  textFont('sans-serif');
  loadLevel(1);
}

function draw() {
  background(255);

  if (isGameOver) {
    drawEndScreen();
    return;
  }

  for (let t of targets) {
    fill(180);
    stroke(120);
    strokeWeight(2);
    renderShape(t.type, t.x, t.y, t.size);
  }

  for (let w of walls) {
    if (w.speedY) {
      w.y += w.speedY;
      if (w.y < w.minY || w.y + w.h > w.maxY) {
        w.speedY *= -1;
      }
    }
    fill(60);
    stroke(20);
    strokeWeight(2);
    rect(w.x, w.y, w.w, w.h, 6);
  }

  for (let s of shapes) {
    if (s.isDragging && !s.isLocked) {
      checkWallCollision(s);
    }
    fill(s.r, s.g, s.b);
    stroke(40);
    strokeWeight(1.5);
    renderShape(s.type, s.x, s.y, s.size);
  }

  if (millis() < feedbackTimer) {
    fill(feedbackColor);
    stroke(60);
    strokeWeight(2);
    rect(width / 2 - 145, height / 2 - 55, 290, 110, 15);

    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(feedbackText, width / 2, height / 2);
    textAlign(LEFT, BASELINE);
  }

  if (levelTransitionTimer > 0 && millis() > levelTransitionTimer) {
    levelTransitionTimer = 0;
    if (currentLevel < MAX_LEVEL) {
      loadLevel(currentLevel + 1);
    } else {
      isGameOver = true;
      playWinSound();
    }
  }
}

function drawEndScreen() {
  fill(145, 195, 125);
  stroke(60);
  strokeWeight(2);
  rect(width / 2 - 200, height / 2 - 110, 400, 220, 20);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(28);
  text("All Levels Complete!", width / 2, height / 2 - 45);
  textSize(22);
  text("Final Score: " + score, width / 2, height / 2 + 5);
  textSize(16);
  fill(40);
  text("Click anywhere to play again", width / 2, height / 2 + 60);
  textAlign(LEFT, BASELINE);
}

function loadLevel(lvl) {
  currentLevel = lvl;
  wrongAttempts = 0;
  shapes = [];
  targets = [];
  walls = [];

  if (lvl === 1) {
    targets = [
      { type: "triangle", x: 820, y: 140, size: 100, isFilled: false },
      { type: "circle",   x: 820, y: 310, size: 90,  isFilled: false },
      { type: "diamond",  x: 820, y: 480, size: 90,  isFilled: false }
    ];
    shapes = [
      { type: "circle",   size: 80,  r: 0,   g: 0,   b: 255 },
      { type: "triangle", size: 100, r: 255, g: 0,   b: 0   },
      { type: "diamond",  size: 90,  r: 0,   g: 255, b: 0   }
    ];
  } else if (lvl === 2) {
    targets = [
      { type: "diamond",   x: 820, y: 140, size: 80, isFilled: false },
      { type: "trapezoid", x: 820, y: 310, size: 85, isFilled: false },
      { type: "pentagon",  x: 820, y: 480, size: 75, isFilled: false }
    ];
    shapes = [
      { type: "trapezoid", size: 85, r: 65,  g: 130, b: 230 },
      { type: "diamond",   size: 80, r: 255, g: 0,   b: 255 },
      { type: "pentagon",  size: 75, r: 255, g: 150, b: 0   }
    ];
  } else if (lvl === 3) {
    targets = [
      { type: "triangle", x: 820, y: 140, size: 90, isFilled: false },
      { type: "circle",   x: 820, y: 310, size: 85, isFilled: false },
      { type: "diamond",  x: 820, y: 480, size: 85, isFilled: false }
    ];
    shapes = [
      { type: "circle",   size: 75, r: 0,   g: 0,   b: 255 },
      { type: "triangle", size: 85, r: 255, g: 0,   b: 0   },
      { type: "diamond",  size: 80, r: 0,   g: 255, b: 0   }
    ];
    walls = [
      { x: 550, y: 0,   w: 25, h: 240 },
      { x: 550, y: 380, w: 25, h: 240 }
    ];
  } else if (lvl === 4) {
    targets = [
      { type: "pentagon",  x: 820, y: 110, size: 70, isFilled: false },
      { type: "trapezoid", x: 820, y: 240, size: 75, isFilled: false },
      { type: "diamond",   x: 820, y: 370, size: 70, isFilled: false },
      { type: "circle",    x: 820, y: 500, size: 70, isFilled: false }
    ];
    shapes = [
      { type: "trapezoid", size: 65, r: 65,  g: 130, b: 230 },
      { type: "diamond",   size: 65, r: 255, g: 0,   b: 255 },
      { type: "pentagon",  size: 65, r: 255, g: 150, b: 0   },
      { type: "circle",    size: 65, r: 0,   g: 200, b: 120 }
    ];
    walls = [
      { x: 460, y: 60,  w: 25, h: 220, speedY: 2.5,  minY: 20, maxY: 600 },
      { x: 640, y: 340, w: 25, h: 220, speedY: -2.5, minY: 20, maxY: 600 }
    ];
  }

  for (let s of shapes) {
    let randX = random(80, 360);
    let randY = random(80, 540);
    s.x = randX;
    s.y = randY;
    s.startX = randX;
    s.startY = randY;
    s.offsetX = 0;
    s.offsetY = 0;
    s.isDragging = false;
    s.isLocked = false;
  }
}

function renderShape(type, x, y, size) {
  let half = size / 2;

  if (type === "circle") {
    circle(x, y, size);
  } else if (type === "triangle") {
    triangle(
      x, y - half,
      x - half, y + half,
      x + half, y + half
    );
  } else if (type === "diamond") {
    quad(
      x, y - half,
      x + half, y,
      x, y + half,
      x - half, y
    );
  } else if (type === "trapezoid") {
    quad(
      x - half * 0.6, y - half * 0.8,
      x + half * 0.6, y - half * 0.8,
      x + half,       y + half * 0.8,
      x - half,       y + half * 0.8
    );
  } else if (type === "pentagon") {
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i - HALF_PI;
      vertex(x + cos(angle) * half, y + sin(angle) * half);
    }
    endShape(CLOSE);
  }
}

function checkWallCollision(s) {
  let r = s.size * 0.42;
  for (let w of walls) {
    let hit = (s.x + r > w.x) &&
              (s.x - r < w.x + w.w) &&
              (s.y + r > w.y) &&
              (s.y - r < w.y + w.h);

    if (hit) {
      s.x = s.startX;
      s.y = s.startY;
      s.isDragging = false;
      applyPenalty("Hit a wall! -5 pts");
      break;
    }
  }
}

function applyPenalty(reasonText) {
  score = max(0, score - 5);
  wrongAttempts++;
  playNegativeSound();

  if (wrongAttempts >= MAX_ATTEMPTS) {
    showFeedback(reasonText + "\nRestarting level...", 235, 160, 155, 1600);
    loadLevel(currentLevel);
  } else {
    showFeedback(reasonText + "\nScore: " + score, 235, 160, 155, 1100);
  }
}

function showFeedback(text, r, g, b, durationMs) {
  feedbackText = text;
  feedbackColor = color(r, g, b);
  feedbackTimer = millis() + durationMs;
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type, duration, delay = 0) {
  initAudio();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration);
}

function playPositiveSound() {
  playTone(523.25, 'sine', 0.12, 0);
  playTone(659.25, 'sine', 0.22, 0.1);
}

function playNegativeSound() {
  playTone(180, 'sawtooth', 0.18, 0);
  playTone(130, 'sawtooth', 0.28, 0.14);
}

function playWinSound() {
  playTone(523.25, 'triangle', 0.12, 0);
  playTone(659.25, 'triangle', 0.12, 0.12);
  playTone(783.99, 'triangle', 0.12, 0.24);
  playTone(1046.50, 'triangle', 0.35, 0.36);
}

function mousePressed() {
  initAudio();

  if (isGameOver) {
    isGameOver = false;
    score = 0;
    loadLevel(1);
    return;
  }

  if (levelTransitionTimer > 0) return;

  for (let i = shapes.length - 1; i >= 0; i--) {
    let s = shapes[i];
    if (s.isLocked) continue;

    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < s.size / 2) {
      s.isDragging = true;
      s.offsetX = s.x - mouseX;
      s.offsetY = s.y - mouseY;
      break;
    }
  }
}

function mouseDragged() {
  if (isGameOver) return;

  for (let s of shapes) {
    if (s.isDragging && !s.isLocked) {
      s.x = mouseX + s.offsetX;
      s.y = mouseY + s.offsetY;
      checkWallCollision(s);
    }
  }
}

function mouseReleased() {
  if (isGameOver) return;

  for (let s of shapes) {
    if (s.isDragging) {
      let r = s.size / 2;
      let matchedTarget = null;

      for (let t of targets) {
        let d = dist(s.x, s.y, t.x, t.y);
        if (d < t.size / 2 + 12) {
          matchedTarget = t;
          break;
        }
      }

      if (matchedTarget) {
        if (matchedTarget.type === s.type && !matchedTarget.isFilled) {
          s.x = matchedTarget.x;
          s.y = matchedTarget.y;
          s.isLocked = true;
          matchedTarget.isFilled = true;
          s.isDragging = false;
          score += 10;
          playPositiveSound();

          let allDone = shapes.every(shape => shape.isLocked);
          if (allDone) {
            if (currentLevel < MAX_LEVEL) {
              showFeedback("Level Complete!\nScore: " + score, 145, 195, 125, 1500);
            } else {
              showFeedback("Final Level Clear!\nScore: " + score, 145, 195, 125, 1500);
            }
            levelTransitionTimer = millis() + 1500;
          } else {
            showFeedback("CORRECT! +10 pts\nScore: " + score, 145, 195, 125, 900);
          }
        } else {
          s.x = s.startX;
          s.y = s.startY;
          s.isDragging = false;
          applyPenalty("Wrong shape! -5 pts");
        }
      } else {
        let isOutside = (s.x - r < 0) || (s.x + r > width) || (s.y - r < 0) || (s.y + r > height);
        if (isOutside) {
          s.x = s.startX;
          s.y = s.startY;
          s.isDragging = false;
          applyPenalty("Out of bounds! -5 pts");
        } else {
          s.isDragging = false;
        }
      }
    }
  }
}
