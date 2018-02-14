const WebSocketServer = require('websocket').server;
const http = require('http');

//Arrays containing list of messages and list of current online users
let messageList = [];
let currentConnections = [];

//Start server and listening on port 8090
const chatServer = http.createServer((request, response) => console.log(' Received request for ' + request.url));
chatServer.listen(8090,() => console.log('Chat Server is listening on port 8090'));
chatWSServer = new WebSocketServer({
    httpServer: chatServer,
    autoAcceptConnections: false
});

chatWSServer.on('request', function(request) {

    //Accept request
    const connection = request.accept('chat', request.origin);

    //Add new connection to array
    currentConnections.push({username: request.resourceURL.query.name, connection: connection});
    console.log(request.resourceURL.query.name+' has logged in');

    //Send message history
    connection.sendUTF(JSON.stringify(messageList));

    connection.on('close', function(reasonCode, description) {
      //Remove connection from current connection array
      const index = currentConnections.map((e) =>{ return e.connection }).indexOf(connection);
      console.log(currentConnections[index].username+ ' has disconnected');
      currentConnections.splice(index,1);
    });

    connection.on('message', function(message) {
      //When message is received, add it to current history and send it to everyone connected
      messageList.push(JSON.parse(message.utf8Data));
      broadcastMessage(JSON.stringify([JSON.parse(message.utf8Data)]));
    });

    connection.on('error', (error) => console.log("Connection Error: " + error.toString()));
});

function broadcastMessage(message){
  currentConnections.map(currentConnection => {
    currentConnection.connection.sendUTF(message);
  });
}
