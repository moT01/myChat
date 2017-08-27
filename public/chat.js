///////////make connection////////////
var socket = io.connect('http://localhost:3000'); //local
//var socket = io.connect('https://my-chat.glitch.me/'); //glitch

////////////query DOM////////////
var ol1 = document.getElementById('ol1'),
	ol2 = document.getElementById('ol2'),
	chatters = document.getElementById('chatters'),
	submitBtn = document.getElementById('submit'), 
	message = document.getElementById('message'),
	handle = document.getElementById('handle'),
	sendBtn = document.getElementById('sendBtn'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback');

////////////functions////////////
function submitHandle() {
	ol1.style.display = 'none';
	ol2.style.display = 'none';
	
	socket.emit('connected', {
		handle: handle.value
	});
}

function sendMessage() {
	socket.emit('chat', {
		message: message.value,
		handle: handle.value	
	});
	message.value = "";
}

////////////emit events to server////////////
submitBtn.addEventListener('click', submitHandle);
handle.addEventListener('keyup', function(e) {
	if(e.keyCode === 13) {
		submitHandle(); }
});

sendBtn.addEventListener('click', sendMessage);
message.addEventListener('keyup', function(e) {
	console.log(e);	
	if(e.keyCode === 13) {
		sendMessage(); }
});

message.addEventListener('keyup', function() {
	socket.emit('typing', {
		handle: handle.value,
		message: message.value
	});
});


////////////listen for events from sockets.io////////////
socket.on('updateChatters', function(connectedUsers) {
	chatters.innerHTML = "";
	connectedUsers = JSON.parse(connectedUsers);
	Object.keys(connectedUsers).forEach(ids => {	
		var div = document.createElement('div');
		div.setAttribute('id',ids);
		div.setAttribute('class','chatter');
		div.innerHTML = connectedUsers[ids];
		chatters.appendChild(div);
	});
});


socket.on('connected', function(id, userName) {
	output.innerHTML += '<p>' + userName + ' has connected</p>';	
});

socket.on('disconnected', function(id, userName) {
	if(userName) {
		output.innerHTML += '<p>' + userName + ' has disconnected</p>';
	}
});

socket.on('chat', function(data) {
	feedback.innerHTML = "";
	output.innerHTML += '<p><strong>' + data.handle + ':</strong> ' + data.message + '</p>';
});

socket.on('typing', function(data) {
	if (data.message.length > 0) {
		feedback.innerHTML = '<p><em>' + data.handle + ' is typing...</em></p>';
	} else {
		feedback.innerHTML = '';	
	}
});