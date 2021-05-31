'use strict';
const io = require('socket.io')(); 

io.on('connection', client=>{
  client.emit('init', {data : 'hello world'});
});

io.listen(3000);
console.log('PORT 3000');