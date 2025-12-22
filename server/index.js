const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Server Running on Port:", PORT);
  console.log("Allowed client origin:", CLIENT_ORIGIN);
});
