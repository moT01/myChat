//make connection
var socket = io.connect('http://localhost:3000'); //local
//var socket = io.connect('https://my-chat.glitch.me/'); //glitch

//query DOM
var message = document.getElementById('message'),
	handle = document.getElementById('handle')
	btn = document.getElementById('send')
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback');
	
//emit events
btn.addEventListener('click', function() {
	socket.emit('chat', {
		message: message.value,
		handle: handle.value	
	});
	message.value = "";
});

message.addEventListener('keyup', function() {
	socket.emit('typing', {
		handle: handle.value,
		message: message.value
	});
});

//listen for events
socket.on('chat', function(data) {
	feedback.innerHTML = "";
	output.innerHTML += "<p><strong>" + data.handle + ":</strong> " + data.message + "</p>";
});

socket.on('typing', function(data) {
	if (data.message.length > 0) {
		feedback.innerHTML = "<p><em>" + data.handle + " is typing a message...</em></p>";
	} else {
		feedback.innerHTML = "";	
	}
});