var express = require('express');
var socket = require('socket.io');

//app setup
var app = express();
var server = app.listen(3000, function () {
	console.log('Listening on port 3000');
});

//static files
app.use(express.static('public'));

//socket setup
var io = socket(server);
var connectedUsers = {};

io.on('connection', function(socket) {
	io.sockets.emit('updateChatters', JSON.stringify(connectedUsers));

	socket.on('chat', function(data) {
		io.sockets.emit('chat', data);
	});

	socket.on('connected', function(data) {
		socket.userName = data.handle;
		console.log(socket.userName + ' has connected - ' + socket.id);
		connectedUsers[socket.id] = socket.userName;
		io.sockets.emit('updateChatters', JSON.stringify(connectedUsers));
		io.sockets.emit('connected', socket.id, socket.userName);
	});
	
	socket.on('disconnect', function() {
		console.log(socket.userName + ' has disconnected - ' + socket.id);
		delete connectedUsers[socket.id];
		io.sockets.emit('updateChatters', JSON.stringify(connectedUsers));
		io.sockets.emit('disconnected', socket.id, socket.userName);
	});

	socket.on('typing', function(data) {
		socket.broadcast.emit('typing', data);
	});

});

