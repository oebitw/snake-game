'use strict';

const app = require('express')();
const http = require('http');
const httpServer=http.createServer(app);
const io = require('socket.io')(http,{cors: {
  origin: '*',
  methods: ['GET', 'POST'],
}});

const { initGame, gameLoop, getUpdatedVelocity } = require('./game-dev');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utlis-dev');

const state ={};     // added state to check the states of all possible rooms  ----------
const clientRooms = {}; // to check room name with a particular user id ----------


io.listen(httpServer);
const express = require('express');
const cors = require('cors');
app.use(cors());
app.use(express.static('./public'));


io.on('connection', client => {
  
  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);  

  function handleJoinGame(roomName) {
    console.log(io.sockets.adapter);
    let room = io.sockets.adapter.rooms.get(roomName);
    // room = String(room);
    console.log(room);
    if (!room) {
      client.emit('unknownCode');
      return;
    } 
    // let allUsers;
    // if (room) {
    //   allUsers = room.sockets;
    // }
    // console.log(allUsers);
    let numClients = 0;
    numClients = room.size;
    // if (allUsers) {
    // }
    console.log(numClients);
    if (numClients > 1) {
      client.emit('tooManyPlayers');
      return;
    }

    clientRooms[client.id] = roomName;

    client.join(roomName);

    client.number = 2;
    client.emit('init', 2);
    
    startGameInterval(roomName);
  }

  // added newGame event handler ----------

  function handleNewGame(){     
    let roomName = makeid(6);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();
    client.join(roomName);
    client.number = 1;
    client.emit('init',1);
  }

  // check the keycode 
  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
      console.log('lll',keyCode);
    } catch(e) {
      console.error(e);
      return;
    }

    const vel = getUpdatedVelocity(keyCode);

    

    if (vel) {
      if(state[roomName]){
        state[roomName].players[client.number - 1].vel = vel;
      }
    }
  }
});

// changed startGameInterval function

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

// added emitGameState function

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

// added emitGameOver function
function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

httpServer.listen(process.env.PORT||3000,()=> console.log('PORT 3000'));
