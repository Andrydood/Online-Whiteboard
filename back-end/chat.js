const WebSocket = require('ws');
const URLSearchParams = require('url-search-params');


//Arrays containing list of messages and list of current online users
let messageList = [];
let currentConnections = [];

//Start server and listening on port 8090
const wss = new WebSocket.Server({ port: 8090 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function(connection, req) {

  const params = new URLSearchParams(req.url);
  const username = params.get('/?name');

  //Add new connection to array
  currentConnections.push({username: username});
  console.log(username+' has logged in');

  //Send message history
  connection.send(JSON.stringify({
    messages:messageList,
    onlineUsers:currentConnections.map(connection=>connection.username)
  }));

  wss.broadcast(JSON.stringify({
    messages:[],
    onlineUsers:currentConnections.map(connection=>connection.username)
  }));

  //Remove connection from current connection array
  connection.on('close', function(reasonCode, description) {
    const index = currentConnections.map((e) =>{ return e.username }).indexOf(username);

    console.log(currentConnections[index].username+ ' has disconnected');

    currentConnections.splice(index,1);

    wss.broadcast(JSON.stringify({
      messages:[],
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));
  });

  //When message is received, add it to current history and send it to everyone connected
  connection.on('message', function(message) {
    messageList.push(JSON.parse(message));
    wss.broadcast(JSON.stringify({
      messages:[JSON.parse(message)],
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));
  });

  connection.on('error', (error) => console.log("Connection Error: " + error.toString()));
});
