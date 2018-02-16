const express = require('express');
const path = require('path');
const WebSocketClient = require('websocket').client;
const sassMiddleware = require('node-sass-middleware');

const app = express();

app.use(sassMiddleware({
  src: path.join(__dirname, 'public/styles/sass'),
  dest: path.join(__dirname, 'public/styles/css'),
  debug: true,
  indentedSyntax: true,
  outputStyle: 'compressed',
  prefix: '/styles/css'
}));

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

app.use(function(req, res, next){
    res.status(404).send("Sorry, page not found");
});

app.listen('3000', ()=>console.log('App listening on 3000'));
