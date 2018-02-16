const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatText = document.getElementById("chatText");
const whiteboardLink = document.getElementById("whiteboardLink");

whiteboardLink.onclick =(()=>window.location = window.location.origin + "/whiteboard");

chatForm.addEventListener("submit",sendMessage);

//When message is submitted, the username and message content are sent
function sendMessage(e){
  e.preventDefault();
  const message = chatInput.value;
  if(!isNullOrWhiteSpace(message)){
    chattingSocket.send(JSON.stringify({username:usernameCookie,message:message}));
    chatInput.value = "";
    scrollChatToBottom();
  }
}

//Initialises connection with server, when a message is received, the
//online user list is deleted and rewritten, and the chat messages are
//displayed
function initChattingSocket(){
  const userList = document.getElementById("userList");

  chattingSocket = new WebSocket( "ws://"+ip+":8090/?name="+usernameCookie,"chat");
  chattingSocket.onmessage = function (event) {
    const messages = JSON.parse(event.data).messages;
    const onlineUsers = JSON.parse(event.data).onlineUsers;
    userList.innerHTML = '';
    onlineUsers.map(user=>displayOnlineUsers(user));
    messages.map(message=>newMessageReceived(message));
  }
}

function newMessageReceived(message){
  const par = document.createElement('p');
  const text = document.createTextNode(message.username+' : '+message.message)
  par.appendChild(text);
  chatText.appendChild(par);
  scrollChatToBottom();
}

//Keep chat scrolled to newest message
function scrollChatToBottom(){
  chatText.scrollTop = chatText.scrollHeight;
}
