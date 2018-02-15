let isMouseDown = false;
const clearButton = document.getElementById('clearButton');
const canvas = document.getElementById('canvas');
const canvasContainer = document.getElementById('canvasContainer');
const ctx = canvas.getContext('2d');
const chatLink = document.getElementById("chatLink");

chatLink.onclick = (()=>window.location = window.location.origin + "/chat");

canvas.addEventListener("mouseup",mouseup);
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener("mousemove",mousemove);

canvas.setAttribute("height", "500px");
canvas.setAttribute("width", "800px");

let strokeEvent = {
  strokeStyle: '',
  lineWidth: '',
  paths: []
};

clearButton.onclick = function(){
  drawingSocket.send('clear');
}

function mousedown(){
  ctx.strokeStyle = document.getElementById('colorPicker').value;
  ctx.lineWidth = document.getElementById('strokePicker').value;;
  ctx.lineCap = 'round';

  const canvasPos = getCanvasPos();

  strokeEvent = {
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
  drawingSocket.send(JSON.stringify(strokeEvent));
}

function replayHistory(strokes){
  if(strokes===null){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  else{
    ctx.strokeStyle = strokes.strokeStyle;
    ctx.lineWidth = strokes.lineWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();
    strokes.paths.map(position=>ctx.lineTo(position.x,position.y));
    ctx.stroke();
  }
}

function initDrawingSocket(){
  drawingSocket = new WebSocket( "ws://"+ip+":8080/","collaborative-whiteboard");
  drawingSocket.onmessage = function (event) {
    const strokes = JSON.parse(event.data);
    strokes.map(stroke=>replayHistory(stroke));
  }
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
