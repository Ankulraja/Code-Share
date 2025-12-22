const express = require("express");
const app = express();
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const ACTIONS = require("./socketAction");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://code-share-neon-chi.vercel.app",
      "https://code-share-production-cb5a.up.railway.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

app.use(express.static("build"));
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

app.use(express.static(path.join(__dirname, '../public')));
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const userSocketMap = {};
const roomUsers = {}; 
const roomCode = {}; 

io.on("connection", (socket) => {

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    const rid = String(roomId || "").trim();
    const uname = String(username || "").trim();
    if (!rid || !uname) {
      return;
    }
    userSocketMap[socket.id] = { username: uname, roomId: rid };

    if (!roomUsers[rid]) {
      roomUsers[rid] = [];
    }
    roomUsers[rid] = roomUsers[rid].filter((u) => u.username !== uname);
    roomUsers[rid].push({ socketId: socket.id, username: uname });

    socket.join(rid);

    const users = roomUsers[rid].reduce((acc, u) => {
      if (!acc.some((x) => x.socketId === u.socketId)) acc.push(u);
      return acc;
    }, []);
    roomUsers[rid] = users;

    io.to(rid).emit(ACTIONS.JOINED, {
      socketId: socket.id,
      username: uname,
      users,
    });

    if (roomCode[rid]) {
      socket.emit(ACTIONS.SYNC_CODE, { code: roomCode[rid] });
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    roomCode[roomId] = code;
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.LEAVE, ({ roomId }) => {
    removeUserFromRoom(socket.id, roomId);
  });

  socket.on("disconnect", () => {
    const user = userSocketMap[socket.id];
    if (user) {
      const { roomId, username } = user;
      removeUserFromRoom(socket.id, roomId);
    }
  });
});

function removeUserFromRoom(socketId, roomId) {
  if (roomUsers[roomId]) {
    roomUsers[roomId] = roomUsers[roomId].filter(
      (u) => u.socketId !== socketId
    );

    io.to(roomId).emit(ACTIONS.DISCONNECTED, {
      socketId,
      users: roomUsers[roomId],
    });

    if (roomUsers[roomId].length === 0) {
      delete roomUsers[roomId];
      delete roomCode[roomId];
    }
  }

  delete userSocketMap[socketId];
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Running on Port: ${PORT}`);
});
