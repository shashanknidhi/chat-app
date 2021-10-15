const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages');
const {joinUser, getCurrentUser,userLeave,roomUser} = require('./utils/users');
//Set static folder

app.use(express.static(path.join(__dirname,'public')));

const botName = 'ChatCord Bot';


io.on('connection', socket=> {
    socket.on('joinroom',({username,room})=>{
        const user = joinUser(socket.id,username,room);

        socket.join(user.room);
        //Welcome current user
        socket.emit('message',formatMessage(botName,'Welcome to ChatChord!'));

    //Broadcast when user gets connected
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${username} has joined the chat`));

    //send user and room info
    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users: roomUser(user.room)
    });
    });
    

    
    //listen for chat message
    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));

    });
    //Runs when user gets disconnect
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat.`));
        //send user and room info
    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users: roomUser(user.room)
    });
        }
        

    });

    

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT , () => console.log("Server running on port "+PORT));