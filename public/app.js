'use strict';

let socket = io();

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const username = prompt('What is your name?');
appendMessage('You joined');
socket.emit('newUser', username);

socket.on('oldChat', data=>{
  if(data.messageStoreArray){
    console.log('DATA',data)
  data.messageStoreArray.forEach(element=>{
    appendMessage(` ${element.username} : ${element.message}`);
  })}
})
socket.on('chatMsg', data=>{
  console.log('DATAAAAAAAA:', data)
  appendMessage(` ${data.username} : ${data.message}`);
});


socket.on('userConnected', username=>{
  appendMessage(`${username} is connected`);

});
socket.on('userDisconnet', username=>{
  console.log('user disconnect function', username)
  appendMessage(`${username} is Disconnected`);
});
messageForm.addEventListener('submit', e=>{
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You : ${message}`);
  
  socket.emit('sendChatMsg', message);
  messageInput.value = '';
  console.log('Event Listener:', message)
});

function appendMessage(message){
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

