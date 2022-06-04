const chatForm = document.getElementById("chat-form");
const chatView = document.getElementById("ChatWindow");
//join chat
function getUrlInfo() {
    var data = window.location.search.substring(1).split("&");
    // data = [ "param=value","param=value","param=value"]
    var usernameArray = data[0].substring(0).split("=");
    //Splits the first string element at the "=" symbol and return and array with the param and value 
    //usernameArray = ["param","value"]
    var username = usernameArray[1].replace("+", " ");
    //Replaces the spaces, if any, in the second element, 
    //which is the value of the param

    var roomArray = data[1].substring(0).split("="); //Repeat steps for the second element
    var room = roomArray[1].replace("+", " ");
    return {
        username,
        room
    }
};

//Get username and room from url using qs library
const { username, room } = getUrlInfo();

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