//Sketch by Tomas Sztorc

const CANV_H = 750;
const CANV_W = 1000;
function setup() {
  let cnv = createCanvas(CANV_W,CANV_H);
  cnv.parent('canvas-box');
}

function drawBalloon(x,y,d,c){
  fill(c);
  circle(x,y,d)
}

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

function spawnBalloon(arr){
  let tmpRad = 50;
  let tmpX = random(0+tmpRad,CANV_W-tmpRad);
  let tmpY = CANV_H+tmpRad;
  let tmpDir = 0;
  let tmpVel = 1;
  arr.push([tmpX,tmpY,tmpRad,tmpVel,tmpDir]);
}

let newBal = true;
let destroy = false;
let score = 0;
var balArr = [];
function main() {
  fill("#000000");
  
  background("#FFFFFF");
  
  if(newBal){
    spawnBalloon(balArr);
    newBal = false;
  }
  
  for(const i in balArr){
    let actArr = balArr[i];
    if(mils(1000/120)){
      actArr[1] -= 4;
    }
    
    let inBound = (dist(actArr[0],actArr[1],mouseX,mouseY) <= actArr[2]);
    if(inBound){
      balC = "#FF2a2a";
      if(mouseIsPressed) destroy = true;
    } else {
      balC = "#FF0000";
    }
    drawBalloon(actArr[0],actArr[1],actArr[2]*2,balC);
    if(actArr[1]<0-actArr[2] || destroy){
      balArr.splice(i);
      destroy = false;
      newBal = true;
    }
  }
}

let game = true;
function draw(){
  if(game)
    if(main()){
      game = false;
    }
}
