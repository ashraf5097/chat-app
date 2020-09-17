const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generatelocationMessage} = require('./utils/generateMessage');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3010
const publicDirectoryPath = path.join(__dirname, '../react-chat-app/chatreact/')
console.log("__dirname = ", __dirname);
if (process.env.NODE_ENV === 'production') {

app.use(express.static(publicDirectoryPath))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../react-chat-app/chatreact/public/index.html'));
  });
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        socket.join(user.room);
        const user1 = getUser(socket.id);

        const users = getUsersInRoom(user1.room);
    
        io.to(user.room).emit('userInRoom', users);
        console.log("userss = ", users);

        socket.to(user.room).emit('message', generateMessage(`${user.username} has joined`,'Admin'));
        callback()
    });

    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        const user = getUser(socket.id);
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
            // console.log("coords = ", coords)
            // let msgLocation = generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username);
        io.emit('message', generatelocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log("Got called");
        
        if (user) {
        const users = getUsersInRoom(user.room);
        let usersAndRoom = {
            users: users,
            room: user.room
        }
        io.to(user.room).emit('userInRoom', users);
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`,'Admin'))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})