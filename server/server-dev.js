'use strict';
const io = require('socket.io')();

// removed createGameState and added initGame instead:  ----------
// Imported makeid from utlis.js
// const { createGameState, gameLoop, getUpdatedVelocity } = require('./game');

const { initGame, gameLoop, getUpdatedVelocity } = require('./game-dev');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utlis-dev');

const state ={};     // added state to check the states of all possible rooms  ----------
const clientRooms = {}; // to check room name with a particular user id ----------

io.on('connection', client => {
  //   client.emit('init', {data : 'hello world'});
  // const state = createGameState();    // Moved and edited in newGame handler ----------


  // Fixed functions names ------------- 
  client.on('keydown', handleKeydown);
  client.on('newGame', handleNewGame);     //  called newGame event ----------
  client.on('joinGame', handleJoinGame);  //  called joinGame event ----------

  // added joinGame event handler ---------

  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    } else if (numClients > 1) {
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
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);
    state[roomName] = initGame(); 
    client.join(roomName);
    client.number = 1;
    client.emit('init',1);
  }


  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e);
      return;
    }

    const vel = getUpdatedVelocity(keyCode);

    if (vel) {
      state[roomName].players[client.number - 1].vel = vel;
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



io.listen(process.env.PORT||3000);
console.log('PORT 3000');