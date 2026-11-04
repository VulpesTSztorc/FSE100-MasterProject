//Sketch by Tomas Sztorc

//predefine global vars
let newBal = false;
let destroy = false;
//let update = false;
let diff = 0;
let score = 0;
let scoreOld = 0;
let lives = 0;
var balArr = [];

//define canvas size
const CANV_H = 750;
const CANV_W = 1000;
const FPS    = 120;
function setup() {
  //link canvas size to HTML
  let cnv = createCanvas(CANV_W,CANV_H);
  cnv.parent('canvas-box');
  frameRate(FPS);
  resetSketch();
}

function resetSketch(){
  newBal = true;
  destroy = false;
  diff = 1;
  score = 0;
  //scoreOld also acts as difficulty change scaler
  scoreOld = 4;
  lives = 3;
  for(let i in balArr)
    balArr.splice(i);
}

//define function to check intervals
let msNew;
let msOld=0;
function mils(x){
  msNew=millis();
  if(msNew-msOld >= x){
    msOld=msNew;
    return true;
  } else {
    return false;
  }
}

//helper function that fills new arrays with data
function spawnBalloon(arr){
  let tmpRad = 50;
  let tmpX = random(0+tmpRad,CANV_W-tmpRad);
  let tmpY = CANV_H+tmpRad;
  //let tmpY = CANV_H;
  let tmpDir = 0;
  let tmpVel = random(1,diff);
  arr.push([tmpX,tmpY,tmpRad,tmpVel,tmpDir]);
}

function drawGameover(){
  //me when im in an unreadable code competition and my
  //opponent is Tomas. 
  background("#aaaaaa");
  //game over box
  fill("#ffffff");
  stroke("#ffffff");
  rect(CANV_W/2-RECT_W/2,CANV_H/2-RECT_H/2,RECT_W,RECT_H,12);
  //"GAME OVER"
  fill(0);
  stroke(0);
  textAlign(CENTER,TOP);
  textSize(48);
  text("GAME OVER",CANV_W/2,CANV_H/2-(RECT_H/2-15));
  //score display
  textSize(32);
  text("Score: " + score,CANV_W/2,CANV_H/2-(RECT_H/2-64));
  //restart directions
  textSize(24);
  textAlign(CENTER,BOTTOM);
  text("Click anywhere to restart!",CANV_W/2,CANV_H/2+(RECT_H/2-15));
  if(mouseIsPressed){
    resetSketch();
    game=true;
  }
}

//main loop here we go
function main() {
  fill("#000000");
  background("#FFFFFF");

  //check if ball needs to be respawned/created
  if(newBal){
    spawnBalloon(balArr);
    if(score != 0 && (score-scoreOld)%(scoreOld) == 0){
      spawnBalloon(balArr);
      console.log(score + ": " + balArr.length);
      scoreOld += score;
      diff++;
    }
    newBal = false;
  }

  //render each ball
  //for(let i in balArr){
  //if(mils(1000/120)) update = true;
  //update=true;
  for(let i=0;i<balArr.length;i++){
    let actArr = balArr[i];
    //manage frame rate and speed. set to 120.
    actArr[1] -= actArr[3];

    //check if mouse is inside current ball
    let inBound = (dist(actArr[0],actArr[1],mouseX,mouseY) <= actArr[2]);
    if(inBound){
      fill("#FF2a2a");
      if(mouseIsPressed){
        destroy = true;
        score++;
      }
    } else {
      fill("#FF0000");
    }
    //x,y,r*2; render balloons
    circle(actArr[0],actArr[1],actArr[2]*2);

    //detect clicks and out of bounds. detract lives if out of bounds
    if(actArr[1]<0-actArr[2] || destroy){
      if(!destroy) lives--;
      balArr.splice(i,1);
      destroy = false;
      newBal = true;
      //quit if all lives lost
      if(lives <= 0) return 1;
    }
  }
}

let game = true;
//for GAME OVER menu
RECT_W = 400;
RECT_H = 200;
function draw(){
  //run the game
  if(game){
    if(main()){
      game = false;
    }
    for(let i=0;i<lives;i++){
      fill("#FF0000");
      circle(CANV_W-25-(25*i),15,20);
    }
    fill(0);
    textAlign(LEFT);
    textSize(32);
    text(score,5,35);
  //run main menu instead
  } else {
    drawGameover();
  }
}
//dont grade on readability plzzzz. it works! idk how but it does! :3
//jokes aside, its ugly as balls, but i understand it.
