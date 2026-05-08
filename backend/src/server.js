require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinExpert', (expertId) => {
      if (expertId) {
        socket.join(`expert:${expertId}`);
      }
    });

    socket.on('leaveExpert', (expertId) => {
      if (expertId) {
        socket.leave(`expert:${expertId}`);
      }
    });
  });

  app.set('io', io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
