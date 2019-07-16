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
const publicDirectoryPath = path.join(__dirname, '../react-chat-app/public')

app.use(express.static(publicDirectoryPath))

console.log("__dirname = ", publicDirectoryPath)
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    
      // old
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', 'Welcome ! ')
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`,'Admin'));
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        const user = getUser(socket.id);

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(message,user.username))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);

        io.emit('locationMessage', generatelocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`,user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log("Got called");
        
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`,'Admin'))
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})