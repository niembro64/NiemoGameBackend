import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const deviceCoordinates = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('register-device', (deviceId) => {
    console.log('Device ID:', deviceId);
    deviceCoordinates[deviceId] = {
      x: 0,
      y: 0,
    };
  });

  socket.on('send-coordinates', (data) => {
    deviceCoordinates[data.deviceId] = data.positions;
    console.log('Broadcasting coordinates:', deviceCoordinates);
    io.emit('receive-coordinates', deviceCoordinates);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    io.emit('receive-coordinates', deviceCoordinates);
  });

  socket.on('connect_error', (err) => {
    console.log('Connection Error:', err);
  });

  socket.on('error', (err) => {
    console.log('Error:', err);
  });

  // Log when the server receives a ping. This is for diagnostic purposes.
  socket.on('ping', () => {
    
    socket.emit('pong');
    console.log('Received ping from', socket.id);
  });
});

httpServer.listen(3000, '0.0.0.0', () => {
  console.log('listening on *:3000');
});
