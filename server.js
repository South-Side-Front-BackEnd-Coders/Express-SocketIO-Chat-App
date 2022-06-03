const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const formatMessage = require('./Utils/messages');
const { userJoin, GetCurrentUser } = require('./Utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const botName = "Dev Chat"

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //Welcome Message
        socket.emit('message', formatMessage(botName, "Welcome To " + user.room + " Chat"));
        //Broadcasts when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    });

    //Server Side Messages
    // listen for message
    socket.on('chatMessage', msg => {

        const user = GetCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    //Runs when a client disconnects
    socket.on('disconnect', () => {
        // const user = GetCurrentUser(socket.id);
        io.emit('message', formatMessage(botName, `Someone has left the chat`))
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Running on port: ${PORT}`));