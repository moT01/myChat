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

io.on('connection', function(socket) {

	socket.on('chat', function(data) {
		io.sockets.emit('chat', data);
	});


	socket.on('typing', function(data) {
		socket.broadcast.emit('typing', data);
	});
	
});

