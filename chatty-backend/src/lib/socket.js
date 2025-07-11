// creating a app using socket.io

import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: 'http://localhost:5173'
    }
});


// used to store online users -> contains object with key-userid and value - socketid
const userSocketMap = {}; // {userId : socket}

// it will return the socket id of a user -> for reat time communication
export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}


io.on('connection', (socket) =>{

    console.log("A user is connected", socket.id);

    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    //io.emit() -> used to send events to all the connected users
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log('A user is disconnected', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})


export {io, app, server}