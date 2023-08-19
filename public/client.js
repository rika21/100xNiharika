const socket = io();

const joinBtn = document.getElementById('joinBtn');
const sendBtn = document.getElementById('sendBtn');
const roomInput = document.getElementById('room');
const messageInput = document.getElementById('message');
const messages = document.getElementById('messages');

joinBtn.addEventListener('click', () => {
  const room = roomInput.value;
  socket.emit('join', room);
});

sendBtn.addEventListener('click', () => {
  const room = roomInput.value;
  const message = messageInput.value;
  socket.emit('chatMessage', { room, message });
  messageInput.value = '';
});

socket.on('message', (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  messages.appendChild(li);
});
