'use strict';

let socket = io();

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const username = prompt('What is your name?');
appendMessage('You joined');
socket.emit('newUser', username);

socket.on('chatMsg', data=>{
  appendMessage(` ${data.username} : ${data.message}`);
});

socket.on('userConnected', username=>{
  appendMessage(`${username} is connected`);
});
// socket.emit('chatMsg', 'hello');
socket.on('userDisconnet', username=>{
  appendMessage(`${username} is Disconnected`);
});
messageForm.addEventListener('submit', e=>{
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You : ${message}`);

  socket.emit('sendChatMsg', message);
  messageInput.value = '';
});

function appendMessage(message){
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}