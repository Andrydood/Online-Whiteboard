let isMouseDown = false;

const canvas = document.getElementById('canvas');
const canvasContainer = document.getElementById('canvasContainer');
const ctx = canvas.getContext('2d');

canvas.addEventListener("mouseup",mouseup);
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener("mousemove",mousemove);

canvas.setAttribute("height", "500px");
canvas.setAttribute("width", "800px");

let strokeEvent = {
  username: '',
  strokeStyle: '',
  lineWidth: '',
  paths: []
};

//Click events
function mousedown(){
  ctx.strokeStyle = document.getElementById('colorPicker').value;
  ctx.lineWidth = document.getElementById('strokePicker').value;;
  ctx.lineCap = 'round';

  const canvasPos = getCanvasPos();

  strokeEvent = {
    username: username,
    strokeStyle: ctx.strokeStyle,
    lineWidth: ctx.lineWidth,
    paths: [{x:canvasPos.x,y:canvasPos.y}]
  };

  isMouseDown = true;
}

function mouseup(){
  isMouseDown = false;
}

function mousemove(){
  if(isMouseDown){
    draw();
  }
}

function getCanvasPos(){
  const clientX = event.clientX;
  const clientY = event.clientY;

  const canvasPosition = canvas.getBoundingClientRect();

  const canvasX = clientX-canvasPosition.x;
  const canvasY = clientY-canvasPosition.y;

  return {x:canvasX, y:canvasY};
}

function draw(){
  const canvasPos = getCanvasPos();
  strokeEvent.paths.push({x:canvasPos.x,y:canvasPos.y});
  sendStrokeToSocket();
}


// canvas.addEventListener("touchstart",touchstart);
// canvas.addEventListener("touchend",touchend);
// canvas.addEventListener("touchmove",touchmove);

// //Touch events
// function touchstart(evt){
//   ctx.strokeStyle = document.getElementById('colorPicker').value;
//   ctx.lineWidth = document.getElementById('strokePicker').value;;
//   ctx.lineCap = 'round';
//
//   const canvasPos = getTouchPos(evt.changedTouches[0]);
//   ctx.beginPath();
//   ctx.moveTo(canvasPos.x,canvasPos.y);
//
//   isMouseDown = true;
// }
//
// function touchend(evt){
//   isMouseDown = false;
//   ctx.stroke();
// }
//
// function touchmove(evt){
//   if(isMouseDown){
//     drawTouch(evt);
//   }
// }
//
// function drawTouch(evt){
//   const canvasPos = getTouchPos(evt.changedTouches[0]);
//   ctx.lineTo(canvasPos.x,canvasPos.y);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.lineTo(canvasPos.x,canvasPos.y);
// }
//
// function getTouchPos(touch){
//   const clientX = touch.clientX;
//   const clientY = touch.clientY;
//
//   const canvasPosition = canvas.getBoundingClientRect();
//
//   const canvasX = clientX-canvasPosition.x;
//   const canvasY = clientY-canvasPosition.y;
//
//   return {x:canvasX, y:canvasY};
// }
