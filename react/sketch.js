var gameState = "start";   

var letters = [];         
var litIndex = -1;       
var lettersLeft = 12;     

var waitUntil = 0;         
var cueTime = 0;           
var timeLimit = 5000;     

var minWait = 1000;     
var maxWait = 5000;        

var countdownStart = 0;  
var lastStage = -1;        
var stageLength = 800;     

var decoyColors = ["blue", "green", "purple", "orange"];
var decoyChance = 0.3;    
var decoyTime = 1500;     
var litIsDecoy = false;    
var litColor = "red";     


var PENALTY_MS = 500;      
var earlyCount = 0;       
var decoyHits = 0;         
var decoysAvoided = 0;     


var messageText = "";     
var messageColor = "white";
var messageUntil = 0;      

var times = [];            
var wrongCount = 0;        
var missedCount = 0;      

var sessionBest = 0;      
var gamesPlayed = 0;

var osc;                  
var beepEnd = 0;           

function setup() {
  createCanvas(700, 480);
  textAlign(CENTER, CENTER);

  osc = new p5.Oscillator("sine");
  osc.amp(0);

  makeLetters();
}

function makeLetters() {
  letters = [
    { name: "A", x: 40,  y: 90,  visible: true },
    { name: "J", x: 440, y: 90,  visible: true },
    { name: "K", x: 630, y: 90,  visible: true },
    { name: "I", x: 330, y: 140, visible: true },
    { name: "B", x: 120, y: 170, visible: true },
    { name: "C", x: 240, y: 170, visible: true },
    { name: "L", x: 600, y: 170, visible: true },
    { name: "D", x: 40,  y: 270, visible: true },
    { name: "E", x: 430, y: 270, visible: true },
    { name: "F", x: 40,  y: 370, visible: true },
    { name: "G", x: 290, y: 370, visible: true },
    { name: "H", x: 650, y: 370, visible: true }
  ];
  lettersLeft = letters.length;
}

function draw() {
  background(207, 224, 242); 

  fill("white");
  stroke("black");
  rect(0, 0, width, 410);

  checkTimers();

  if (gameState == "start") {
    drawHomePage();
  } else if (gameState == "instructions") {   // NEW
    drawInstructions();
  } else if (gameState == "done") {
    drawResults();
  } else if (gameState == "countdown") {      // NEW
    drawGetReady();
    drawHomeButton();
  } else {
    noStroke();
    fill("black");
    textSize(24);
    text("Reaction", width / 2, 25);

    drawLetters();
    drawMessage();
    drawCountdown();
    drawHomeButton();
  }

  drawFooter();
}

function checkTimers() {
  if (beepEnd > 0 && millis() > beepEnd) {
    osc.amp(0, 0.05);
    beepEnd = 0;
  }

  if (gameState == "countdown") {
    var stage = floor((millis() - countdownStart) / stageLength);

    if (stage != lastStage) {      
      lastStage = stage;
      if (stage == 0 || stage == 1) {
        playBeep(500);                 
      } else if (stage == 2) {
        playBeep(1000);               
      }
    }

    if (stage >= 3) {
      startNextRound();
    }
  }
  if (gameState == "waiting" && millis() >= waitUntil) {
    lightUpLetter();
  }

  if (gameState == "cued") {
    if (litIsDecoy == true && millis() - cueTime >= decoyTime) {
      decoysAvoided = decoysAvoided + 1;
      showMessage("Decoy ignored!", "lightgreen");
      startNextRound();
    } else if (litIsDecoy == false && millis() - cueTime >= timeLimit) {
      missedCount = missedCount + 1;
      showMessage("Too slow! +" + PENALTY_MS + " ms", "gold");
      startNextRound();
    }
  }
}

function drawHomePage() {
  noStroke();
  fill("black");
  textSize(36);
  text("Reaction", width / 2, 90);

  textSize(18);
  text("Click the letter as soon as it turns red and makes a noise.", width / 2, 140);

  fill(66, 133, 244);   
  stroke("black");
  rect(260, 180, 180, 60, 12);
  noStroke();
  fill("white");
  textSize(24);
  text("Start", 350, 210);

  if (gamesPlayed > 0) {
    fill("black");
    textSize(16);
    text("Games played: " + gamesPlayed + "     Best time: " + sessionBest + " ms", width / 2, 300);
  }
}

function drawInstructions() {
  noStroke();
  fill("black");
  textSize(30);
  text("How to Play", width / 2, 35);

  textSize(18);
  text("Wait for a letter to turn RED and make a beep.", width / 2, 80);
  text("Then click the red letter as fast as you can!", width / 2, 108);

  textSize(46);
  fill("red");    text("A", 130, 165);
  fill("blue");   text("B", 290, 165);
  fill("green");  text("C", 370, 165);
  fill("purple"); text("D", 450, 165);
  fill("orange"); text("E", 530, 165);

  textSize(16);
  fill("black");
  text("CLICK", 130, 205);
  text("IGNORE these decoys", 410, 205);

  textSize(18);
  text("Any color that is not red is a decoy. Do not click it!", width / 2, 245);

  textSize(16);
  text("Clicking too early, the wrong letter, a decoy, or being too slow", width / 2, 280);
  text("adds a " + PENALTY_MS + " ms penalty to your score.", width / 2, 302);

  fill(66, 133, 244);
  stroke("black");
  rect(260, 335, 180, 50, 12);
  noStroke();
  fill("white");
  textSize(22);
  text("Got it!", 350, 360);
}

function drawGetReady() {
  var stage = floor((millis() - countdownStart) / stageLength);
  if (stage > 2) {
    stage = 2;   
  }

  var words = ["Ready...", "Set...", "GO!"];
  var colors = ["orange", "gold", "green"];

  noStroke();
  fill(colors[stage]);
  textSize(80);
  text(words[stage], width / 2, 170);

  fill("black");
  textSize(18);
  text("Only click the RED letters!", width / 2, 270);
}

function drawResults() {
  var correct = times.length;
  var average = getAverage();
  var fastest = getFastest();
  var slowest = getSlowest();
  var penalties = getPenaltyCount();   

  var accuracy = 0;
  if (correct + penalties > 0) {
    accuracy = round(correct / (correct + penalties) * 100);
  }

  noStroke();
  fill("black");
  textSize(30);
  text("Results", width / 2, 30);

  textSize(18);
  text("Average reaction time", width / 2, 65);
  textSize(44);
  fill(66, 133, 244);
  text(average + " ms", width / 2, 105);

  fill("black");
  textSize(18);
  text("Score with penalties: " + getScore() + " ms", width / 2, 145);
  textSize(14);
  text("(" + penalties + " mistakes x " + PENALTY_MS + " ms added)", width / 2, 167);
 
  fill("black");
  textSize(18);
  textAlign(LEFT, CENTER);
  text("Fastest: " + fastest + " ms",       190, 195);
  text("Slowest: " + slowest + " ms",       190, 222);
  text("Correct: " + correct + " / 12",     190, 249);
  text("Accuracy: " + accuracy + "%",       190, 276);
  text("Best ever: " + sessionBest + " ms", 190, 303);

  text("Too early: " + earlyCount,          400, 195);  
  text("Wrong letters: " + wrongCount,      400, 222);
  text("Decoys clicked: " + decoyHits,      400, 249);   
  text("Too slow: " + missedCount,          400, 276);
  text("Decoys ignored: " + decoysAvoided,  400, 303);  
  textAlign(CENTER, CENTER);

  textSize(18);
  fill(0, 120, 0);
  text(getRating(average), width / 2, 328);

  fill(66, 133, 244);
  stroke("black");
  rect(150, 345, 180, 50, 12);
  noStroke();
  fill("white");
  textSize(22);
  text("Play again", 240, 370);

  fill(120);
  stroke("black");
  rect(370, 345, 180, 50, 12);
  noStroke();
  fill("white");
  text("Home", 460, 370);
}

function drawHomeButton() {
  fill(120);
  stroke("black");
  rect(10, 425, 80, 32, 8);
  noStroke();
  fill("white");
  textSize(16);
  text("Home", 50, 441);
}

function drawFooter() {
  noStroke();
  fill("black");
  textSize(16);
  if (gameState == "waiting" || gameState == "cued") {
    text("Cleared: " + times.length + " / 12     Penalties: " + getPenaltyCount(), width / 2, 441);
  }
}

function drawLetters() {
  textSize(36);
  noStroke();
  for (var i = 0; i < letters.length; i++) {
    if (letters[i].visible == true) {
      if (i == litIndex) {
        fill(litColor);  
      } else {
        fill("gray");
      }
      text(letters[i].name, letters[i].x, letters[i].y);
    }
  }
}

function drawMessage() {
  if (millis() < messageUntil) {
    fill(messageColor);
    stroke("black");
    rect(10, 10, 230, 45, 8);  
    noStroke();
    fill("black");
    textSize(16);
    text(messageText, 125, 33);  
  }
}

function drawCountdown() {
  if (gameState == "cued" && litIsDecoy == false) {
    var secondsLeft = ceil((timeLimit - (millis() - cueTime)) / 1000);
    fill("black");
    noStroke();
    textSize(28);
    text(secondsLeft, 670, 30);
  }
}

function getAverage() {
  if (times.length == 0) {
    return 0;
  }
  var total = 0;
  for (var i = 0; i < times.length; i++) {
    total = total + times[i];
  }
  return round(total / times.length);
}

function getFastest() {
  if (times.length == 0) {
    return 0;
  }
  return min(times);   
}

function getSlowest() {
  if (times.length == 0) {
    return 0;
  }
  return max(times);   
}

function getRating(avg) {
  if (avg == 0) {
    return "No correct clicks this time. Try again!";
  } else if (avg < 500) {
    return "Lightning fast!";
  } else if (avg < 900) {
    return "Nice reflexes!";
  } else if (avg < 1500) {
    return "Good job, keep practicing!";
  } else {
    return "Keep going. You will get faster!";
  }
}

function getPenaltyCount() {
  return earlyCount + wrongCount + decoyHits + missedCount;
}

function getScore() {
  if (times.length == 0) {
    return 0;
  }
  var total = 0;
  for (var i = 0; i < times.length; i++) {
    total = total + times[i];
  }
  total = total + getPenaltyCount() * PENALTY_MS;
  return round(total / times.length);
}

function showMessage(msg, col) {
  messageText = msg;
  messageColor = col;
  messageUntil = millis() + 1500;
}

function playBeep(pitch) {
  osc.freq(pitch);
  osc.start();
  osc.amp(0.3, 0.02);
  beepEnd = millis() + 200;  
}

function startGame() {
  makeLetters();
  times = [];
  wrongCount = 0;
  missedCount = 0;
  earlyCount = 0;        
  decoyHits = 0;         
  decoysAvoided = 0;     
  messageUntil = 0;

  // was: startNextRound();
  gameState = "countdown";        
  countdownStart = millis();      
  lastStage = -1;                 
}

function goHome() {
  litIndex = -1;
  messageUntil = 0;
  gameState = "start";
}

function startNextRound() {
  litIndex = -1;

  if (lettersLeft == 0) {
    finishGame();
    return;
  }

  gameState = "waiting";
  waitUntil = millis() + random(minWait, maxWait);  
}

function finishGame() {
  gamesPlayed = gamesPlayed + 1;
  var fastest = getFastest();
  if (fastest > 0 && (sessionBest == 0 || fastest < sessionBest)) {
    sessionBest = fastest;
  }
  gameState = "done";
}

function lightUpLetter() {
  var choice = floor(random(letters.length));
  while (letters[choice].visible == false) {  
    choice = floor(random(letters.length));
  }
  litIndex = choice;
  cueTime = millis();   
  gameState = "cued";

  if (random() < decoyChance) {
    litIsDecoy = true;
    litColor = random(decoyColors);  
    playBeep(500);
  } else {
    litIsDecoy = false;
    litColor = "red";
    playBeep(880);
  }
}

function mousePressed() {

  if (gameState == "start") {
    if (mouseX > 260 && mouseX < 440 && mouseY > 180 && mouseY < 240) {
      userStartAudio();   
      gameState = "instructions";   
    }
    return;
  }

  if (gameState == "instructions") {
    if (mouseX > 260 && mouseX < 440 && mouseY > 335 && mouseY < 385) {
      userStartAudio();
      startGame();
    }
    return;
  }
 
  if (gameState == "done") {
    if (mouseX > 150 && mouseX < 330 && mouseY > 345 && mouseY < 395) {
      userStartAudio();
      startGame(); 
    }
    if (mouseX > 370 && mouseX < 550 && mouseY > 345 && mouseY < 395) {
      goHome();
    }
    return;
  }

  if (mouseX > 10 && mouseX < 90 && mouseY > 425 && mouseY < 457) {
    goHome();
    return;
  }

  if (gameState == "countdown") {
    return;
  }
 
  for (var i = 0; i < letters.length; i++) {
    var d = dist(mouseX, mouseY, letters[i].x, letters[i].y);

    if (letters[i].visible == true && d < 30) {
      letterClicked(i);
      return;
    }
  }
}

function letterClicked(i) {

  if (gameState == "waiting") {
    earlyCount = earlyCount + 1;
    waitUntil = millis() + random(minWait, maxWait);   
    showMessage("Too early! +" + PENALTY_MS + " ms", "tomato");
    return;
  }

  if (i == litIndex && litIsDecoy == true) {
    decoyHits = decoyHits + 1;
    showMessage("Decoy! +" + PENALTY_MS + " ms", "tomato");
    startNextRound();
    return;
  }
  if (i != litIndex) {
    wrongCount = wrongCount + 1;
    showMessage("Wrong letter! +" + PENALTY_MS + " ms", "tomato");   
    return;
  }

  var reactionTime = round(millis() - cueTime);
  times.push(reactionTime);       
  letters[i].visible = false;
  lettersLeft = lettersLeft - 1;

  playBeep(1200);
  showMessage("CORRECT " + reactionTime + " ms", "lightgreen");
  startNextRound();
}

