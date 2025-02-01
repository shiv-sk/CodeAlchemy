const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require("cors");

const app = express();
app.use(cors({
    origin:true
}))
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
    //messages
    socket.on("message" , ({message})=>{
        io.emit("message" , { message, senderId: socket.id });
    })

})
app.use(express.json());
const AiCode = require("./index");
app.post("/api/v1/code/debug" , AiCode.codeDebug);
app.post("/api/v1/code/explain" , AiCode.explainCode);

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});