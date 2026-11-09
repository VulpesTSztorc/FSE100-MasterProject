//I store unused functions here, in case its needed in future

function drawStart(){
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
  text("WELCOME",CANV_W/2,CANV_H/2-(RECT_H/2-15));
  //score display
  textSize(32);
  //text("Score: " + score,CANV_W/2,CANV_H/2-(RECT_H/2-64));
  //restart directions
  textSize(24);
  textAlign(CENTER,BOTTOM);
  text("Click anywhere to begin!",CANV_W/2,CANV_H/2+(RECT_H/2-15));
  if(mouseIsPressed){
    resetSketch();
    game=true;
    stMenu=false;
  }
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
