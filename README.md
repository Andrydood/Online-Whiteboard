# Online Whiteboard/Chat

### Intro

This project was made to test a websocket connection between a server running nodeJS and a client made with express.

The project asks for your username (which is saved and remembered) and connects you to either an online collaborative whiteboard or a public chatroom.
The user is able to see other online users, send them message, read their message, see the live real time state of the board and interact with it.
They can also change the color and size of the marker.

### Install Instructions

While in the root folder of the repository

For the back end:
```
cd back-end
npm install
node index.js
```

For the front end:
```
cd front-end
npm install
node app.js
```

The app will be available on localhost:3000

The "ip" variable in the front-end/public/scripts/sharedFunctions.js folder is currently set as 'localhost', but should be changed to the ip of the server.
