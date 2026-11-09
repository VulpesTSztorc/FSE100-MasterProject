let rx = 200;
let ry = 300;
let rw = 200;

let ax = 500;
let ay = 300;
let aw = 200;

let showIncorrect = false;
let showCorrect = false;

// Levels and timer
let level = 1;
let totalLevels = 5;
let levelTime = 20;      // seconds allowed for the current level
let startTime = 0;       // when the current level began
let timeLeft = 20;
let penalty = 0;         // seconds lost from wrong clicks
let instruction = 'Click on the left circle';
let correctIsLeft = true;
let levelDone = false;
let doneTime = 0;
let gameOver = false;
let gameWon = false;

const windowWidth = 700;
const windowHeight = 500;
function setup() {
  //IMPORTANT, to miranda: when updating, DO NOT TOUCH THESE NEXT 2 LINES!!
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('canvas-box');

  loadLevel(1);

  describe('The word " Click on the left circle" is written in black across a lime square. Two circles below change color when hovered. Clicking the correct circle shows a "Correct" message in the top-left corner and moves to the next level. Clicking the wrong circle shows an "Incorrect, please try again!" message and costs time. A timer counts down in the top-right corner.');
}

function loadLevel(n) {
  level = n;
  showCorrect = false;
  showIncorrect = false;
  levelDone = false;
  penalty = 0;
  startTime = millis();

  // default layout
  rx = 200; ry = 300; rw = 200;
  ax = 500; ay = 300; aw = 200;

  if (n == 1) {
    instruction = 'Click on the left circle';
    correctIsLeft = true;
    levelTime = 20;
  } else if (n == 2) {
    instruction = 'Click on the right circle';
    correctIsLeft = false;
    levelTime = 15;
  } else if (n == 3) {
    instruction = 'Click on the bigger circle';
    rw = 150;
    aw = 260;
    correctIsLeft = false;
    levelTime = 12;
  } else if (n == 4) {
    instruction = 'Click on the smaller circle';
    rw = 100;
    aw = 240;
    correctIsLeft = true;
    levelTime = 10;
  } else if (n == 5) {
    instruction = 'Click on the higher circle';
    ry = 450;
    ay = 300;
    correctIsLeft = false;
    levelTime = 8;
  }
}

function draw() {
  background('#ffffff');

  // Update timer
  if (!levelDone && !gameOver && !gameWon) {
    timeLeft = levelTime - (millis() - startTime) / 1000 - penalty;
    if (timeLeft <= 0) {
      timeLeft = 0;
      gameOver = true;
    }
  }

  // Move on after a correct answer
  if (levelDone && millis() - doneTime > 1200) {
    if (level == totalLevels) {
      gameWon = true;
    } else {
      loadLevel(level + 1);
    }
  }

  // Instruction box
  stroke('black');
  strokeWeight(1);
  fill('#d6f1ff');
  rect(290, 90, 140, 95);

  fill('black');
  noStroke();
  textSize(17);
  textAlign(LEFT, TOP);
  text(instruction, 308, 98, 125, 85);

  // Right circle (red on hover)
  stroke('black');
  strokeWeight(1);
  fill(dist(ax, ay, mouseX, mouseY) < aw / 2 ? 'pink' : 'white');
  circle(ax, ay, aw);

  // Left circle (lime on hover)
  fill(dist(rx, ry, mouseX, mouseY) < rw / 2 ? 'purple' : 'white');
  circle(rx, ry, rw);

  // Level and timer (top-right)
  noStroke();
  fill(timeLeft <= 3 ? 'red' : 'black');
  textSize(20);
  textAlign(RIGHT, TOP);
  text('Level: ' + level + ' / ' + totalLevels, width - 20, 15);
  text('Time: ' + ceil(timeLeft), width - 20, 45);

  // Correct message (top-left corner)
  if (showCorrect) {
    stroke('black');
    strokeWeight(2);
    fill('#d6ffd6');
    rect(10, 10, 300, 50);

    noStroke();
    fill('green');
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Correct, move on to next level!', 10, 10, 300, 50);
  }

  // Incorrect message (top-left corner)
  if (showIncorrect) {
    stroke('black');
    strokeWeight(2);
    fill('#ffd6d6');
    rect(10, 10, 300, 50);

    noStroke();
    fill('red');
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Incorrect, please try again! (-2 sec)', 10, 10, 300, 50);
  }

  // Game over message
  if (gameOver) {
    stroke('black');
    strokeWeight(2);
    fill('#ffd6d6');
    rect(width / 2 - 150, height / 2 - 60, 300, 120);

    noStroke();
    fill('red');
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Time's up! You reached level " + level + ".\nClick to play again.", width / 2 - 150, height / 2 - 60, 300, 120);
  }

  // Win message
  if (gameWon) {
    stroke('black');
    strokeWeight(2);
    fill('#d6ffd6');
    rect(width / 2 - 150, height / 2 - 60, 300, 120);

    noStroke();
    fill('green');
    textSize(20);
    textAlign(CENTER, CENTER);
    text('You beat all ' + totalLevels + ' levels!\nClick to play again.', width / 2 - 150, height / 2 - 60, 300, 120);
  }
} // <-- end of draw()

function mousePressed() {
  // Restart after game over or win
  if (gameOver || gameWon) {
    gameOver = false;
    gameWon = false;
    loadLevel(1);
    return;
  }

  // Ignore clicks while waiting for next level
  if (levelDone) {
    return;
  }

  // Left circle
  if (dist(rx, ry, mouseX, mouseY) < rw / 2) {
    if (correctIsLeft) {
      showCorrect = true;
      showIncorrect = false;
      levelDone = true;
      doneTime = millis();
    } else {
      showIncorrect = true;
      showCorrect = false;
      penalty += 2;
    }
  }
  // Right circle
  else if (dist(ax, ay, mouseX, mouseY) < aw / 2) {
    if (!correctIsLeft) {
      showCorrect = true;
      showIncorrect = false;
      levelDone = true;
      doneTime = millis();
    } else {
      showIncorrect = true;
      showCorrect = false;
      penalty += 2;
    }
  }
  // Clicked elsewhere
  else {
    showCorrect = false;
    showIncorrect = false;
  }
}
