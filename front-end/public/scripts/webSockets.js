const drawingSocket = new WebSocket( "ws://10.134.214.147:8080/","collaborative-whiteboard");

drawingSocket.onmessage = function (event) {
  const strokes = JSON.parse(event.data);
  strokes.map(stroke=>replayHistory(stroke));
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
