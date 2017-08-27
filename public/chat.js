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


////////////emit events to server////////////
submitBtn.addEventListener('click', function() {
	ol1.style.display = 'none';
	ol2.style.display = 'none';
	
	socket.emit('connected', {
		handle: handle.value
	});
});

sendBtn.addEventListener('click', function() {
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
	output.innerHTML += '<p>' + userName + ' has connected, ' + id + '</p>';	
});

socket.on('disconnected', function(userInfo) {
	//remove(id) from chatters	
	if(userInfo.userName) {
		output.innerHTML += '<p>' + userInfo.userName + ' has disconnected, ' + userInfo.id + '</p>';
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