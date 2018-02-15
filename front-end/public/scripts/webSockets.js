function initDrawingSocket(){
  drawingSocket = new WebSocket( "ws://"+ip+":8080/","collaborative-whiteboard");
  drawingSocket.onmessage = function (event) {
    const strokes = JSON.parse(event.data);
    strokes.map(stroke=>replayHistory(stroke));
  }
}

function initChattingSocket(){
  chattingSocket = new WebSocket( "ws://"+ip+":8090/?name="+username,"chat");
  chattingSocket.onmessage = function (event) {
    const messages = JSON.parse(event.data);
    messages.map(message=>newMessage(message));
  }
}

function sendStrokeToSocket(){
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

const clearButton = document.getElementById('clearButton');
clearButton.onclick = function(){
  drawingSocket.send('clear');
}
