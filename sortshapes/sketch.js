let currentLevel = 1;
let wrongAttempts = 0;
const MAX_ATTEMPTS = 3;

let walls = [];

let shapes = [];
let targets = [];

let feedbackText = "";
let feedbackColor = null;
let feedbackTimer = 0;
let levelTransitionTimer = 0;

function setup() {
  let cnv = createCanvas(950, 620);
  cnv.parent("canvas-box");
  textFont('sans-serif');
  loadLevel(1);
}

function draw() {
  background(255);

  for (let t of targets) {
    fill(180);
    stroke(120);
    strokeWeight(2);
    renderShape(t.type, t.x, t.y, t.size);
  }

  for (let s of shapes) {
    fill(s.r, s.g, s.b);
    stroke(40);
    strokeWeight(1.5);
    renderShape(s.type, s.x, s.y, s.size);
  }

  if (millis() < feedbackTimer) {
    fill(feedbackColor);
    stroke(60);
    strokeWeight(2);
    rect(width / 2 - 135, height / 2 - 55, 270, 110, 15);

    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(feedbackText, width / 2, height / 2);
    textAlign(LEFT, BASELINE);
  }

  if (levelTransitionTimer > 0 && millis() > levelTransitionTimer) {
    levelTransitionTimer = 0;
    if (currentLevel === 1) {
      loadLevel(2);
    } else {
      showFeedback("Activity Complete!", 145, 195, 125, 3000);
      loadLevel(1);
    }
  }
}

function loadLevel(lvl) {
  currentLevel = lvl;
  wrongAttempts = 0;
  shapes = [];
  targets = [];

  if (lvl === 1) {
    targets = [
      { type: "triangle", x: 800, y: 130, size: 100, isFilled: false },
      { type: "circle",   x: 800, y: 260, size: 90,  isFilled: false },
      { type: "diamond",  x: 800, y: 390, size: 90,  isFilled: false }
    ];

    shapes = [
      { type: "circle",   size: 80,  r: 0,   g: 0,   b: 255 },
      { type: "triangle", size: 100, r: 255, g: 0,   b: 0   },
      { type: "diamond",  size: 90,  r: 0,   g: 255, b: 0   }
    ];
  } else if (lvl === 2) {
    targets = [
      { type: "diamond",   x: 800, y: 130, size: 80, isFilled: false },
      { type: "trapezoid", x: 800, y: 260, size: 85, isFilled: false },
      { type: "pentagon",  x: 800, y: 390, size: 75, isFilled: false }
    ];

    shapes = [
      { type: "trapezoid", size: 85, r: 65,  g: 130, b: 230 },
      { type: "diamond",   size: 80, r: 255, g: 0,   b: 255 },
      { type: "pentagon",  size: 75, r: 255, g: 150, b: 0   }
    ];
  }

  for (let s of shapes) {
    let randX = random(100, 500);
    let randY = random(80, 500);
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

function showFeedback(text, r, g, b, durationMs) {
  feedbackText = text;
  feedbackColor = color(r, g, b);
  feedbackTimer = millis() + durationMs;
}

function resetActivity() {
  loadLevel(currentLevel);
}

function mousePressed() {
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
  for (let s of shapes) {
    if (s.isDragging && !s.isLocked) {
      s.x = mouseX + s.offsetX;
      s.y = mouseY + s.offsetY;
    }
  }
}

function mouseReleased() {
  for (let s of shapes) {
    if (s.isDragging) {
      let r = s.size / 2;
      let matchedTarget = null;

      for (let t of targets) {
        let d = dist(s.x, s.y, t.x, t.y);
        if (d < t.size / 2 + 10) {
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

          let allDone = shapes.every(shape => shape.isLocked);
          if (allDone) {
            showFeedback("CORRECT!\nNext Level...", 145, 195, 125, 1600);
            levelTransitionTimer = millis() + 1600;
          } else {
            showFeedback("CORRECT", 145, 195, 125, 900);
          }
        } else {
          s.x = s.startX;
          s.y = s.startY;
          s.isDragging = false;
          wrongAttempts++;

          if (wrongAttempts >= MAX_ATTEMPTS) {
            showFeedback("Incorrect.\nRestarting activity...", 235, 160, 155, 1800);
            resetActivity();
          } else {
            showFeedback("Shape does not\nmatch! Try again...", 235, 160, 155, 1200);
          }
        }
      } else {
        let isOutside = (s.x - r < 0) || (s.x + r > width) || (s.y - r < 0) || (s.y + r > height);
        if (isOutside) {
          s.x = s.startX;
          s.y = s.startY;
        }
        s.isDragging = false;
      }
    }
  }
}
