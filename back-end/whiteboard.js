const WebSocket = require('ws');
const URLSearchParams = require('url-search-params');

let strokeList = [];
let latestStroke = null;
let currentConnections = [];

//Start server and listening on port 8090
const wss = new WebSocket.Server({ port: 8080 });

//Sends message to everyone
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

  //Add new user to array
  currentConnections.push({username: username});
  console.log(username + ' has logged in');

  //Send stroke history to new connection
  connection.send(JSON.stringify({
    strokes:strokeList,
    onlineUsers:currentConnections.map(connection=>connection.username)
  }));

  //Send everyone the new user list
  wss.broadcast(JSON.stringify({
    strokes:[],
    onlineUsers:currentConnections.map(connection=>connection.username)
  }));

  //Remove connection from current connection array and send everyone the new user list
  connection.on('close', function(reasonCode, description) {
    const index = currentConnections.map((e) =>{ return e.username }).indexOf(username);

    console.log(currentConnections[index].username+ ' has disconnected');

    currentConnections.splice(index,1);

    wss.broadcast(JSON.stringify({
      strokes:[],
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));
  });

  //If message is 'clear', send null to indicate to clear the board
  //Otherwise send everyone the received latest stroke
  connection.on('message', function(message) {
    if(message === 'clear'){
      strokeList=[];
      latestStroke=null;
    }
    else{
      strokeList.push(JSON.parse(message));
      latestStroke = JSON.parse(message);
    }
    wss.broadcast(JSON.stringify({
      strokes:[latestStroke],
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));
  });

  connection.on('error', (error) => console.log("Connection Error: " + error.toString()));
});
