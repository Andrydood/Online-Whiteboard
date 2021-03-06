const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatText = document.getElementById("chatText");
const whiteboardLink = document.getElementById("whiteboardLink");

whiteboardLink.onclick = (() => { window.location = `${window.location.origin}/whiteboard`; });

// Keep chat scrolled to newest message
function scrollChatToBottom() {
  chatText.scrollTop = chatText.scrollHeight;
}


// When message is submitted, the username and message content are sent
function sendMessage(e) {
  e.preventDefault();
  const message = chatInput.value;
  if (!isNullOrWhiteSpace(message)) {
    chattingSocket.send(JSON.stringify({ username: usernameCookie, message }));
    chatInput.value = "";
    scrollChatToBottom();
  }
}

// Initialises connection with server, when a message is received, the
// online user list is deleted and rewritten, and the chat messages are
// displayed
function newMessageReceived(message) {
  const par = document.createElement("p");
  const text = document.createTextNode(`${message.username} : ${message.message}`);
  par.appendChild(text);
  chatText.appendChild(par);
  scrollChatToBottom();
}

function initChattingSocket() {
  const userList = document.getElementById("userList");

  chattingSocket = new WebSocket(`ws://${ip}:8090/?name=${usernameCookie}`, "chat");
  chattingSocket.onmessage = (event) => {
    const { messages, onlineUsers } = JSON.parse(event.data);
    userList.innerHTML = "";
    onlineUsers.map(user => displayOnlineUsers(user));
    messages.map(message => newMessageReceived(message));
  };
}

chatForm.addEventListener("submit", sendMessage);
