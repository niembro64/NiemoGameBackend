// import express from 'express';

// import http from 'http';
import { Server } from 'socket.io';

const http = require('http');

const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// const deviceCoordinates: { [socketId: string]: { x: number; y: number } } = {};
const deviceCoordinates = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('register-device', (deviceId) => {
    console.log('Device ID:', deviceId);
    // Store the device ID, associate it with the socket.id if needed
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

    // Remove this device's coordinates
    // delete deviceCoordinates[socket.id];

    // Broadcast the updated set of coordinates to all clients
    io.emit('receive-coordinates', deviceCoordinates);
  });

  socket.on('connect_error', (err) => {
    console.log('Connection Error:', err);
  });

  socket.on('error', (err) => {
    console.log('Error:', err);
  });
});

// httpServer.listen(3000, () => {
//   console.log('listening on *:3000');
// });
httpServer.listen(3000, '0.0.0.0', () => {
  console.log('listening on *:3000');
});
