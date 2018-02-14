const loginScreen =  document.getElementById("loginScreen");
const mainContainer =  document.getElementById("mainContainer");
const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("nameInput");

loginForm.addEventListener("submit",loginFunction);

loginScreen.style.display = "block";
mainContainer.style.display = "none";

let username = "user";
let drawingSocket;
let chattingSocket;

function loginFunction(e){
  e.preventDefault();
  username = nameInput.value;
  loginScreen.style.display = "none";
  mainContainer.style.display = "block";
  initDrawingSocket();
  initChattingSocket();
}

function initDrawingSocket(){
  drawingSocket = new WebSocket( "ws://192.168.0.47.:8080/","collaborative-whiteboard");
  drawingSocket.onmessage = function (event) {
    const strokes = JSON.parse(event.data);
    strokes.map(stroke=>replayHistory(stroke));
  }
}

function initChattingSocket(){
  chattingSocket = new WebSocket( "ws://192.168.0.47.:8090/?name="+username,"chat");
  chattingSocket.onmessage = function (event) {
    const messages = JSON.parse(event.data);
    messages.map(message=>newMessage(message));
  }
}
