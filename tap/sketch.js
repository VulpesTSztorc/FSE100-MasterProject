//Sketch by Tomas Sztorc

const CANV_H = 750;
const CANV_W = 1000;
function setup() {
  let cnv = createCanvas(CANV_W,CANV_H);
  cnv.parent('canvas-box');
}

function balloon(x,y,d,c){
  fill(c);
  circle(x,y,d)
}

function draw() {
  background("#FFFFFF");
  let balX = CANV_W/2;
  let balY = CANV_H/2;
  let balD = CANV_W/10;


  let inBound = (dist(balX,balY,mouseX,mouseY) < balD/2);
    
  if(inBound){
    balC = "#00FF00";
  } else {
    balC = "#FF0000";
  }
  
  balloon(balX,balY,balD,balC);
}
