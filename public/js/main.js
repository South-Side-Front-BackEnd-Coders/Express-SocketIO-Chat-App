const chatForm = document.getElementById("chat-form");
const chatView = document.getElementById("ChatWindow");

//Get username and room from url using qs library
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chat

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    DisplayMyMessage(message);
    chatView.scrollTop = chatView.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.messageInput.value;

    socket.emit('chatMessage', msg);
    e.target.elements.messageInput.value = "";
    e.target.elements.messageInput.focus();

});

function DisplayMyMessage(message) {

    const div = document.createElement('div');
    div.classList.add('ChatItem');
    div.classList.add('MyMessage');
    const senderDiv = document.createElement('div');
    senderDiv.classList.add('ChatSender');
    senderDiv.textContent = message.username + " " + message.time
    div.append(senderDiv);
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ChatMessage');
    messageDiv.textContent = message.text;
    div.append(messageDiv);
    chatView.appendChild(div);
};

function DisplaySenderMessage(message) {

    const div = document.createElement('div');
    div.classList.add('ChatItem');
    div.classList.add('SenderMessage');
    const senderDiv = document.createElement('div');
    senderDiv.classList.add('ChatSender');
    senderDiv.textContent = "Other"
    div.append(senderDiv);
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ChatMessage');
    messageDiv.textContent = message;
    div.append(messageDiv);
    chatView.appendChild(div);
};