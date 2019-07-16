// const io = require('socket.io-client')
// import openSocket from 'socket.io-client';
import openSocket from 'socket.io-client';
var conn_options = {
  'sync disconnect on unload':false
};
const  socket = openSocket.connect('http://localhost:3010',conn_options);

export default function () {
  // const socket = io.connect('http://localhost:3010')



 let welcomeMessage = (cb) =>  socket.on('message', (message) => {
  cb(null, message);
 });

 let userInroom = (cb) => socket.on('userInRoom',(user) => {
  console.log("user = ", user);
  cb(null, user);

 });

// 
 let sendMessage = (msg) => {
   console.log("in client sent msg");
   
  socket.emit('sendMessage', msg, (error) => {

    if (error) {
        return console.log(error)
    }

  }) 
}

let sendLocation = (location) => {
  
  socket.emit('sendLocation', location, (error) => {
   if (error) return console.log(error)
 }) 
}

let newUserJoin = (username, room) => {
  socket.emit('join', {username, room}, (error) => {
    if (error) {
      alert(error);
    }
  })
}

return {  welcomeMessage, sendMessage, newUserJoin, sendLocation, userInroom };
//   function registerHandler(onMessageReceived) {
//     socket.on('message', onMessageReceived)
//   }

//   function unregisterHandler() {
//     socket.off('message')
//   }

//   socket.on('error', function (err) {
//     console.log('received socket error:')
//     console.log(err)
//   })

//   socket.on('message',(msg)=>{
//     console.log("msg = ", msg);
    
//   })

//   function register(name, cb) {
//     socket.emit('register', name, cb)
//   }

//   function join(chatroomName, cb) {
//     socket.emit('join', chatroomName, cb)
//   }

//   function leave(chatroomName, cb) {
//     socket.emit('leave', chatroomName, cb)
//   }

//   function message(chatroomName, msg, cb) {
//     socket.emit('message', { chatroomName, message: msg }, cb)
//   }

//   function getChatrooms(cb) {
//     socket.emit('chatrooms', null, cb)
//   }

//   function getAvailableUsers(cb) {
//     socket.emit('availableUsers', null, cb)
//   }

//   return {
//     register,
//     join,
//     leave,
//     message,
//     getChatrooms,
//     getAvailableUsers,
//     registerHandler,
//     unregisterHandler
//   }
}


