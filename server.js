var app = require('express')();
var http = require('http').Server(app);
///const fs = require('fs');
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var sockets = {};
var usernames = {};

io.on('connection', function(socket){

  socket.on('adduser', function(roomName , sender, receiver) {
    socket.sender = sender;
    socket.receiver = receiver;
    usernames[sender] = sender;
    socket.room = roomName;
    socket.join(roomName);
  });

  socket.on('sendchat', function(data) {

    io.sockets["in"](socket.room).emit('updatechat', socket.room,socket.sender,socket.receiver, data);
    io.emit('allusermessage', socket.room,socket.sender,socket.receiver, data);
  });

  socket.on('showtyping', function(roomName , sender) {
    socket.broadcast.to(socket.room).emit('showtyping',socket.room,socket.sender);
  });


  socket.on('switchRoom', function(newroom) {

    var oldroom;
    oldroom = socket.room;
    socket.leave(socket.room);
    socket.join(newroom);
    socket.room = newroom;
    //socket.broadcast.to(socket.room).emit('testing','sssss');

  });
});

http.listen(port, function(){
  console.log('listening on testing*:'+port);
});
