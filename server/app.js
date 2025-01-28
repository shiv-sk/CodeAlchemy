const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server , {
    cors:{
        origin:"*"
    }
});

const userSocketMap = {};
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            userName:userSocketMap[socketId]
        }
    });
}
io.on("connection" , (socket)=>{
    console.log("the socket is! " , socket.id);
    socket.on("join" , ({roomId , userName})=>{
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit("joined" , {
                clients,
                userName,
                socketId:socket.id
            })
        });
    })

    socket.on("code-change" , ({roomId , updatedCode})=>{
        socket.to(roomId).emit("code-change" , {
            updatedCode,
            socketId:socket.id
        })
    })
    socket.on("disconnecting" , ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected" , {
                socketId:socket.id,
                userName:userSocketMap[socket.id]
            })
        });
        delete userSocketMap[socket];
        socket.leave();
    })

})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});