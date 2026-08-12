const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const registerChatSocket = require('./chatSocket');

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow anonymous connection for public features if needed, or require auth
      socket.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      return next();
    } catch (err) {
      console.warn('[Socket Auth Warning] Invalid socket token:', err.message);
      socket.user = null;
      return next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id} | User: ${socket.user ? socket.user.id : 'Anonymous'}`);

    if (socket.user) {
      // Join user specific room
      socket.join(`user:${socket.user.id}`);
      if (socket.user.role === 'admin') {
        socket.join('admin');
        console.log(`[Socket.IO] User ${socket.user.id} joined 'admin' room`);
      }
    }

    // Register Chat & Custom events
    registerChatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[Socket.IO] Server initialized');
  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
