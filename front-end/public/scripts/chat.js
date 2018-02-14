const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatText = document.getElementById("chatText");
chatForm.addEventListener("submit",sendMessage);

function isNullOrWhiteSpace(str) {
  return (!str || str.length === 0 || /^\s*$/.test(str));
}

function sendMessage(e){
  e.preventDefault();
  const message = chatInput.value;
  if(!isNullOrWhiteSpace(message)){
    chattingSocket.send(JSON.stringify({username:username,message:message}));
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
