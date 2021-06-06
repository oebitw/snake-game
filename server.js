'use strict'; 

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
let messageStore = {
  messageStoreArray: []
};
let messageStoreArray = [];
console.log('message Store :::',messageStore)
io.on('connection', socket =>{
  socket.on('newUser', username=>{
    users[socket.id]= username;
    socket.emit('oldChat', messageStore)
        socket.broadcast.emit('userConnected', username);
  });
  socket.on('sendChatMsg', message=>{
    console.log('disconnect', io.sockets.adapter.rooms.get(socket.id))
    messageStoreArray.push({message: message, username: users[socket.id]})
    messageStore.messageStoreArray= messageStoreArray ;
    socket.broadcast.emit('chatMsg', {message: message, username: users[socket.id]});
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnet', users[socket.id]);
    if (!io.sockets.adapter.rooms.get(socket.id)) {
      delete messageStore.messageStoreArray;
    }
    delete users[socket.id];
})
});


httpServer.listen(process.env.PORT||3030,()=> console.log('PORT 3030'));
