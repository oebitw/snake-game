'use strict';
const io = require('socket.io')(); 
const { createGameState, gameLoop, getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants');


io.on('connection', client=>{
//   client.emit('init', {data : 'hello world'});
  const state = createGameState();
  client.on('keydown', handelKeydown); 
  function handelKeydown(keyCode){
    try{
      keyCode =parseInt(keyCode);
    } catch(e){
      console.log(e);
      return;
    }
    const vel = getUpdatedVelocity(keyCode);
    if(vel){
      state.player.vel = vel;
    }
  }
  startGameInterval(client, state);
});

function   startGameInterval(client, state){
  const intervalId = setInterval(()=>{
    const winner = gameLoop(state);
    if(!winner){
      client.emit('gameState', JSON.stringify(state));
    } else {
      client.emit('gameOver');
      clearInterval(intervalId);
    }
  }, 1000/FRAME_RATE);
}


io.listen(3000);
console.log('PORT 3000');