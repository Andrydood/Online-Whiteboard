const express = require('express');
const path = require('path');
const WebSocketClient = require('websocket').client;

const app = express();

app.use("/", express.static(path.resolve(__dirname, 'public')));

app.set('view engine', 'pug');

app.get('/',(req,res)=>{
  res.render('login') 
});

app.get('/whiteboard',(req,res)=>{
  res.render('whiteboard') 
});

app.get('/chat',(req,res)=>{
  res.render('chat') 
});

app.listen('3000', ()=>console.log('App listening on 3000'));
