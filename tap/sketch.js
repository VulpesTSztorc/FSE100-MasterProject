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
let initVal = 4;

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
  scoreOld = initVal;
  lives = 3;
  for(let i in balArr)
    balArr.splice(i);
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

//define textbox/button dimensions
const TBOX_H = 65;
const TBOX_W = 400;
const TBOX_X = CANV_W/2-TBOX_W/2;
const TBOX_Y = CANV_H/2-TBOX_H/2-170;

const DIFF_H = 40;
const DIFF_W = 60;
const DIFF_X = CANV_W/2-DIFF_W/2;
const DIFF_Y = CANV_H/2-DIFF_H/2-100;

const BU_H   = DIFF_H;
const BU_W   = DIFF_W;
const BUMI_X = CANV_W/2-DIFF_W-DIFF_W/2-10;
const BUMI_Y = CANV_H/2-DIFF_H/2-100;
const BUPL_X = CANV_W/2+DIFF_W/2+10;
const BUPL_Y = CANV_H/2-DIFF_H/2-100;

const STRT_H = 40;
const STRT_W = 200;
const STRT_X = CANV_W/2-STRT_W/2
const STRT_Y = DIFF_Y + (STRT_H+15)

var mouseIncr = 0; //make sure a click only works ONCE

function drawStart(){
  background("#aaaaaa");
  fill("#ffffff");
  stroke("#ffffff");
  //draw static elements
  rect(TBOX_X,TBOX_Y,TBOX_W,TBOX_H,12);
  rect(DIFF_X,DIFF_Y,DIFF_W,DIFF_H,12);
  
  stroke(0);
  fill(0);
  textAlign(CENTER,CENTER);
  textWrap(WORD);
  textSize(16);
  text("Value below determines after how many balls the game gets harder. Press start to begin.",
  TBOX_X,CANV_H/2-TBOX_H/2-(170-TBOX_H/2),TBOX_W-5);

  textSize(32);
  text(initVal,DIFF_X,CANV_H/2-DIFF_H/2-(100-DIFF_H/2),DIFF_W-5);

  //check for mouse click.
  if(mouseIsPressed){
    mouseIncr++;
  } else {
    mouseIncr = 0;
  }

  //minus
  //checking if hover
  if(mouseX<BUMI_X+BU_W && mouseX>BUMI_X && mouseY<BUMI_Y+BU_H && mouseY>BUMI_Y){
    fill("green");
    //check for click. only accept first increment
    if(mouseIncr==1 && initVal > 1)
      initVal--;
  } else {
    fill("white");
  }
  //render
  rect(BUMI_X,BUMI_Y,BU_W,BU_H,12);
  fill(0);
  text('-',BUMI_X,CANV_H/2-DIFF_H/2-(100-DIFF_H/2),BU_W-5);

  //plus
  if(mouseX<BUPL_X+BU_W && mouseX>BUPL_X && mouseY<BUPL_Y+BU_H && mouseY>BUPL_Y){
    fill("green");
    if(mouseIncr==1)
      initVal++;
  } else {
    fill("white");
  }
  rect(BUPL_X,BUPL_Y,BU_W,BU_H,12);
  fill(0);
  text('+',BUPL_X,CANV_H/2-DIFF_H/2-(100-DIFF_H/2),BU_W-5);

  //start
  if(mouseX<STRT_X+STRT_W && mouseX>STRT_X && mouseY<STRT_Y+STRT_W && mouseY>STRT_Y){
    fill("green");
    if(mouseIsPressed){
      resetSketch();
      game=true;
      stMenu=false;
    }
  } else {
    fill("white");
  }
  rect(STRT_X,STRT_Y,STRT_W,STRT_H,12);
  fill(0);
  text("start",STRT_X,STRT_Y+20,STRT_W-5);  
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
  //if(mils(1000/120)) update = true; //replaced with FPS
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

let game = false;
let stMenu = true;
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
  } else if(stMenu) {
    drawStart();
  } else {
    drawGameover();
  }
}
//dont grade on readability plzzzz. it works! idk how but it does! :3
//jokes aside, its ugly as balls, but i understand it.
