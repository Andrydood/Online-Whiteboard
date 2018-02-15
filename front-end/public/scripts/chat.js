const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatText = document.getElementById("chatText");
const whiteboardLink = document.getElementById("whiteboardLink");

whiteboardLink.onclick =(()=>window.location = window.location.origin + "/whiteboard");

chatForm.addEventListener("submit",sendMessage);

function initChattingSocket(){
  chattingSocket = new WebSocket( "ws://"+ip+":8090/?name="+usernameCookie,"chat");
  chattingSocket.onmessage = function (event) {
    const messages = JSON.parse(event.data);
    messages.map(message=>newMessage(message));
  }
}

function sendMessage(e){
  e.preventDefault();
  const message = chatInput.value;
  if(!isNullOrWhiteSpace(message)){
    chattingSocket.send(JSON.stringify({username:usernameCookie,message:message}));
    chatInput.value = "";
    scrollChatToBottom();
  }
}

function newMessage(message){
  const par = document.createElement('p');
  const text = document.createTextNode(message.username+' : '+message.message)
  par.appendChild(text);
  chatText.appendChild(par);
  scrollChatToBottom();
}

function scrollChatToBottom(){
  chatText.scrollTop = chatText.scrollHeight;
}
