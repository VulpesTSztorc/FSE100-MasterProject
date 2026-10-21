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
  var balArr = [[200,100,100],[500,100,100]];

  for(const i in balArr){
    let actArr = balArr[i];
    let inBound = (dist(actArr[0],actArr[1],mouseX,mouseY) < actArr[2]/2);
    
    if(inBound){
      balC = "#00FF00";
    } else {
      balC = "#FF0000";
    }
    balloon(actArr[0],actArr[1],actArr[2],balC);
  }
  
}
