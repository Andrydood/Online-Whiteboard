let isMouseDown = false;
const clearButton = document.getElementById('clearButton');
const canvas = document.getElementById('canvas');
const canvasContainer = document.getElementById('canvasContainer');
const ctx = canvas.getContext('2d');
const chatLink = document.getElementById("chatLink");

//Go to chatroom
chatLink.onclick = (()=>window.location = window.location.origin + "/chat");

//Clear screen
clearButton.onclick = (()=> drawingSocket.send('clear'));

canvas.addEventListener("mouseup",mouseup);
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener("mousemove",mousemove);

canvas.setAttribute("height", "500px");
canvas.setAttribute("width", "600px");

//Define initial stroke
let strokeEvent = {
  strokeStyle: '',
  lineWidth: '',
  paths: []
};

let previousPosition = []

//When mouse is first clicked, the stroke properties and the initial position is
//logged
function mousedown(){
  ctx.strokeStyle = document.getElementById('colorPicker').value;
  ctx.lineWidth = document.getElementById('strokePicker').value;;
  ctx.lineCap = 'round';

  const canvasPos = getCanvasPos();

  strokeEvent = {
    strokeStyle: ctx.strokeStyle,
    lineWidth: ctx.lineWidth,
    paths: []
  };

  previousPosition = {x:canvasPos.x,y:canvasPos.y};

  isMouseDown = true;
}

function mouseup(){
  isMouseDown = false;
}

//Every time the mouse moves, the line being drawn (previous+current mouse position)
//along with the properties are sent to the server
function mousemove(){
  if(isMouseDown){
    draw();
  }
}

function draw(){
  const canvasPos = getCanvasPos();
  const currentPosition = {x:canvasPos.x,y:canvasPos.y};
  strokeEvent.paths = [previousPosition,
                      currentPosition];
  drawingSocket.send(JSON.stringify(strokeEvent));
  previousPosition = currentPosition;
}

function getCanvasPos(){
  const clientX = event.clientX;
  const clientY = event.clientY;

  const canvasPosition = canvas.getBoundingClientRect();

  const canvasX = clientX-canvasPosition.x;
  const canvasY = clientY-canvasPosition.y;

  return {x:canvasX, y:canvasY};
}

//Initialises connection with server, when a message is received, the
//online user list is deleted and rewritten, and the canvas strokes are
//drawn
function initDrawingSocket(){
  const userList = document.getElementById("userList");

  drawingSocket = new WebSocket( "ws://"+ip+":8080/?name="+usernameCookie,"collaborative-whiteboard");
  drawingSocket.onmessage = function (event) {
    const strokes = JSON.parse(event.data).strokes;
    const onlineUsers = JSON.parse(event.data).onlineUsers;
    userList.innerHTML = '';
    onlineUsers.map(user=>displayOnlineUsers(user));
    strokes.map(stroke=>replayHistory(stroke));
  }
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

//Identical functions to the click based ones but for touch screens
canvas.addEventListener("touchstart",touchstart);
canvas.addEventListener("touchend",touchend);
canvas.addEventListener("touchmove",touchmove);

function touchstart(evt){
  ctx.strokeStyle = document.getElementById('colorPicker').value;
  ctx.lineWidth = document.getElementById('strokePicker').value;;
  ctx.lineCap = 'round';

  const canvasPos = getTouchPos(evt.changedTouches[0]);

  strokeEvent = {
    strokeStyle: ctx.strokeStyle,
    lineWidth: ctx.lineWidth,
    paths: [{x:canvasPos.x,y:canvasPos.y}]
  };

  isMouseDown = true;
}

function touchend(evt){
  isMouseDown = false;
}

function touchmove(evt){
  if(isMouseDown){
    drawTouch(evt);
  }
}


function getTouchPos(touch){
  const clientX = touch.clientX;
  const clientY = touch.clientY;

  const canvasPosition = canvas.getBoundingClientRect();

  const canvasX = clientX-canvasPosition.x;
  const canvasY = clientY-canvasPosition.y;

  return {x:canvasX, y:canvasY};
}

function drawTouch(evt){
  const canvasPos = getTouchPos(evt.changedTouches[0]);
  strokeEvent.paths.push({x:canvasPos.x,y:canvasPos.y});
  drawingSocket.send(JSON.stringify(strokeEvent));
}
