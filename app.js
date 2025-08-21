import express from 'express'
import http from 'http'
import * as io from 'socket.io'
import {} from 'dotenv/config.js'
import { socketController } from './sockets/controller.js';

const app=express();
const server=  http.createServer(app);
const ioSocket= new io.Server(server);
app.use(express.static('public'));

ioSocket.on('connecyion', socketController);

server.listen(process.env.PORT,()=>{
    console.log('servidor corriedo en el puerto',process.env.PORT)
});