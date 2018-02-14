const WebSocketServer = require('websocket').server;
const http = require('http');

const drawingServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
});

drawingServer.listen(8080, function() {
    console.log((new Date()) + 'Drawing Server is listening on port 8080');
});

drawingWSServer = new WebSocketServer({
    httpServer: drawingServer,
    autoAcceptConnections: false
});

let strokeList = [];
let latestStroke = [null];

drawingWSServer.on('request', function(request) {

    const connection = request.accept('collaborative-whiteboard', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    connection.sendUTF(JSON.stringify(strokeList));

    connection.on('error', function(error) {
      console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    connection.on('message', function(message) {
      if(message.utf8Data === 'clear'){
        strokeList=[];
        latestStroke=[null];
      }
      else{
        strokeList.push(JSON.parse(message.utf8Data));
        latestStroke = [JSON.parse(message.utf8Data)];
      }
    });

    setInterval(function(){
      connection.sendUTF(JSON.stringify(latestStroke));
    }, 33);

});
