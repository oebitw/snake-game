'use strict';

let bgColor= 'black';
let snakeColor='red';
let foodColor='green';
const gameScreen = document.getElementById('gameScreen');
let canvas , ctx;


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

