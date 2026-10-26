//Sketch by Tomas Sztorc

//predefine global vars
let newBal = false;
let destroy = false;
let score = 0;
let lives = 0;
var balArr = [];

//define canvas size
const CANV_H = 750;
const CANV_W = 1000;
function setup() {
  //link canvas size to HTML
  let cnv = createCanvas(CANV_W,CANV_H);
  cnv.parent('canvas-box');

  resetSketch();
}

function resetSketch(){
  newBal = true;
  destroy = false;
  score = 0;
  lives = 3;
  for(let i in balArr)
    ballArr.splice(i);
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
  let tmpDir = 0;
  let tmpVel = 1;
  arr.push([tmpX,tmpY,tmpRad,tmpVel,tmpDir]);
}

//main loop here we go
function main() {
  fill("#000000");
  background("#FFFFFF");

  //check if ball needs to be respawned/created
  if(newBal){
    spawnBalloon(balArr);
    newBal = false;
    if(score % 3 == 0){
      spawnBalloon(balArr);
    }
  }

  //render each ball
  for(let i in balArr){
    let actArr = balArr[i];
    //manage frame rate and speed. set to 120.
    if(mils(1000/120)){
      actArr[1] -= 4;
    }

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

//game/menu logic loop. lowkey halfassed cause sleep deprived.
//it works. dont look into it.
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
      game = true;
    }
  }
}
//dont grade on readability plzzzz. it works! idk how but it does! :3
//jokes aside, its ugly as balls, but i understand it.
