'use strict'; 

// const io = require('socket.io')(3030);
const app = require('express')();
const http = require('http');
const httpServer=http.createServer(app);
const io = require('socket.io')(http,{cors: {
  origin: '*',
  methods: ['GET', 'POST'],
}});

io.listen(httpServer);
const express = require('express');
const cors = require('cors');
app.use(cors());
app.use(express.static('./public'));

const users = {};

io.on('connection', socket =>{
  socket.on('newUser', username=>{
    users[socket.id]= username;
    socket.broadcast.emit('userConnected', username);
  });
  
  socket.on('sendChatMsg', message=>{
    socket.broadcast.emit('chatMsg', {message: message, username: users[socket.id]});
  });
  socket.on('disconnet', ()=>{
    socket.broadcast.emit('userDisconnet', users[socket.id]);
    delete users[socket.id];
  });
  
});


httpServer.listen(process.env.PORT||3030,()=> console.log('PORT 3030'));
