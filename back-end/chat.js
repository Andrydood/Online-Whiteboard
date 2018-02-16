const WebSocket = require("ws");
const URLSearchParams = require("url-search-params");
/* eslint-disable no-shadow */

// Arrays containing list of messages and list of current online users
const messageList = [];
const currentConnections = [];

// Start server and listening on port 8090
const wss = new WebSocket.Server({ port: 8090 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", (connection, req) => {
  const params = new URLSearchParams(req.url);
  const username = params.get("/?name");

  // Add new connection to array of online users
  currentConnections.push({ username });
  console.log(`${username} has logged in`);

  // Send message history
  connection.send(JSON.stringify({
    messages: messageList,
    onlineUsers: currentConnections.map(connection => connection.username),
  }));

  // Send everyone the new  user list
  wss.broadcast(JSON.stringify({
    messages: [],
    onlineUsers: currentConnections.map(connection => connection.username),
  }));

  // Remove connection from current connection array and send everyone the new user list
  connection.on("close", (reasonCode, description) => {
    const index = currentConnections.map(e => e.username).indexOf(username);

    console.log(`${currentConnections[index].username} has disconnected`);

    currentConnections.splice(index, 1);

    wss.broadcast(JSON.stringify({
      messages: [],
      onlineUsers: currentConnections.map(connection => connection.username),
    }));
  });

  // When message is received, add it to current history and send it to everyone connected
  connection.on("message", (message) => {
    messageList.push(JSON.parse(message));
    wss.broadcast(JSON.stringify({
      messages: [JSON.parse(message)],
      onlineUsers: currentConnections.map(connection => connection.username),
    }));
  });

  connection.on("error", error => console.log(`Connection Error: ${error.toString()}`));
});
