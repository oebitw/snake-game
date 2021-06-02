'use strict';

let bgColor= '#231f20';
let snakeColor='#c2c2c2';
let foodColor='#e66916';



// const io = require('socket.io')(); 
// console.log('yyyyyyyyyyy');
// eslint-disable-next-line no-undef
const socket = io('https://sleepy-island-33889.herokuapp.com/');
// console.log('aaaaaaaaaaaaaa');
socket.on('init', handelInit);
socket.on('gameState', handelGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers',handleTooManyPlayers);

const initialScreen = document.getElementById('initialScreen');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameScreen = document.getElementById('gameScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');

newGameBtn.addEventListener('click',newGame);
joinGameBtn.addEventListener('click',joinGame);

// changed init to init() ----------------------
function newGame(){
  socket.emit('newGame');
  init();    
}

function joinGame(){
  const code = gameCodeInput.value;
  socket.emit('joinGame',code);
  init();
}

let canvas , ctx;
let gameActive = false;
let playerNumber;


/* changeds:     ----------------------
1-   gameScreen.style.display='block';
*/
function init(){

  initialScreen.style.display='none';
  gameScreen.style.display='block';
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  
  canvas.width = canvas.height = 800;
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  document.addEventListener('keydown', keydown);
  gameActive=true;
}
function keydown(e){
  // console.log(e.keyCode);
  socket.emit('keydown', e.keyCode);
}

// init();

function paintGame(state){
  // ctx.fillStyle = bgColor;

  let grd = ctx.createLinearGradient(0.000, 150.000, 300.000, 150.000);
  // Add colors
  grd.addColorStop(0.000, 'rgba(247, 149, 51, 1.000)');
  grd.addColorStop(0.151, 'rgba(243, 112, 85, 1.000)');
  grd.addColorStop(0.311, 'rgba(239, 78, 123, 1.000)');
  grd.addColorStop(0.462, 'rgba(161, 102, 171, 1.000)');
  grd.addColorStop(0.621, 'rgba(80, 115, 184, 1.000)');
  grd.addColorStop(0.748, 'rgba(16, 152, 173, 1.000)');
  grd.addColorStop(0.875, 'rgba(7, 179, 155, 1.000)');
  grd.addColorStop(1.000, 'rgba(111, 186, 130, 1.000)');
  ctx.fillStyle = grd;

  const gridsize = state.gridsize;
  //conventing it to game space 
  const size = canvas.width / gridsize;

  // console.log(state.players[0].snake.length);
  for (let i = 0; i < state.players[0].snake.length; i++) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // if (state.snake[i].x == state.snakeX && state.snake[i].y == state.snakeY) {
    //   state.size = 3;
    // }
  }
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;


  ctx.fillStyle = foodColor;
  //conventing it to canvas space 
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, grd);
  paintPlayer(state.players[1], size, 'pink');
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;

  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

// paintGame(gameState);

function handelInit(number){
  playerNumber=number;
}

function handelGameState (gameState){
  if(!gameActive) return;
  gameState = JSON.parse(gameState);
  requestAnimationFrame(()=>paintGame(gameState));
}

function handleGameOver(data){
  if(!gameActive){
    return;
  }
  data=JSON.parse(data);
  gameActive = false;
  if(data.winner === playerNumber) alert('You Win');//strich goal :add emotion
  else alert('You Lose');//strich goal :add emotion
}

function handleGameCode(gameCode){
  gameCodeDisplay.innerText=gameCode;
}

function handleUnknownCode(){
  reset();
  alert('the Code is not correct');
}

function handleTooManyPlayers(){
  reset();
  alert('this game is already in progress');
}

function reset(){
  playerNumber=null;
  gameCodeInput.value='';
  initialScreen.style.display='block';
  gameScreen.style.display='none';
  gameCodeDisplay.innerText='';
}