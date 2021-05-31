'use strict';

let bgColor= 'black';
let snakeColor='tomato';
let foodColor='green';
const gameScreen = document.getElementById('gameScreen');

// const io = require('socket.io')(); 
console.log('yyyyyyyyyyy');
const socket = io('http://localhost:3000');
console.log('aaaaaaaaaaaaaa');
socket.on('init', handelInit);
console.log('tttttttt');

let canvas , ctx;

const gameState = {
  player : {
    x : 3,
    y : 10,
  },
  vel :{
    x : 1,
    y : 0,
  },
  snake : [
    {x:1, y:10},
    {x:2, y:10},
    {x:3, y:10},

  ],
  food : {
    x : 7, 
    y : 7,
  },
  gridsize : 20,
};

function init(){

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  
  canvas.width = canvas.height = 600;
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  document.addEventListener('keydown', keydown);
}
function keydown(e){
  console.log(e.keyCode);
}

init();

function paintGame(state){
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  //conventing it to game space 
  const size = canvas.width / gridsize;

  ctx.fillStyle = foodColor;
  //conventing it to canvas space 
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.player, size, snakeColor);
  // paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, colour) {
  const snake = gameState.snake;

  ctx.fillStyle = colour;

  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

paintGame(gameState);

function handelInit(msg){
  console.log(msg);
}


