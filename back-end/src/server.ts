import express, { NextFunction, Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

interface MessageProps{
    author: string
    message: string;
}

const app = express()

const httpServer = createServer(app)

const socket = new Server(httpServer, {
    cors:{
        origin: "http://localhost:3000"
    }
})

app.use(cors())

let messages:MessageProps[] = []

socket.on("connection", socket =>{
    console.log(`|▶ ${socket.id} Conectou`);

    socket.emit('previousMessage', messages)

    socket.on("sendMessage", data =>{
        messages.push(data)
        socket.broadcast.emit("receivedMessage", data)
    })
})

app.get("/", (req:Request, res:Response) =>{
    return res.json({
        message: "Funcionou"
    })
})


httpServer.listen(3333, () =>{
    console.log("Server Rodando");
})