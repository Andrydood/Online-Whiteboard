const WebSocketServer = require('websocket').server;
const http = require('http');

let strokeList = [];
let latestStroke = null;
let currentConnections = [];

const drawingServer = http.createServer((request, response) => console.log(' Received request for ' + request.url));

drawingServer.listen(8080,() => console.log('Chat Server is listening on port 8080'));

drawingWSServer = new WebSocketServer({
    httpServer: drawingServer,
    autoAcceptConnections: false
});

drawingWSServer.on('request', function(request) {

    const connection = request.accept('collaborative-whiteboard', request.origin);

    //Add new connection to array
    currentConnections.push({username: request.resourceURL.query.name, connection: connection});
    console.log(request.resourceURL.query.name+' has logged in');

    //Send message history
    connection.sendUTF(JSON.stringify({
      strokes:strokeList,
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));

    broadcastMessage(JSON.stringify({
      strokes:[],
      onlineUsers:currentConnections.map(connection=>connection.username)
    }));

    connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function(reasonCode, description) {
      //Remove connection from current connection array
      const index = currentConnections.map((e) =>{ return e.connection }).indexOf(connection);

      console.log(currentConnections[index].username+ ' has disconnected');

      currentConnections.splice(index,1);
      broadcastMessage(JSON.stringify({
        strokes:[],
        onlineUsers:currentConnections.map(connection=>connection.username)
      }));
    });

    connection.on('message', function(message) {
      if(message.utf8Data === 'clear'){
        strokeList=[];
        latestStroke=null;
      }
      else{
        strokeList.push(JSON.parse(message.utf8Data));
        latestStroke = JSON.parse(message.utf8Data);
      }
      broadcastMessage(JSON.stringify({
        strokes:[latestStroke],
        onlineUsers:currentConnections.map(connection=>connection.username)
      }));
    });

});

function broadcastMessage(message){
  currentConnections.map(currentConnection => {
    currentConnection.connection.sendUTF(message);
  });
}
