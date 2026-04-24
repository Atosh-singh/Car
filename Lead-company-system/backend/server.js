require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const socketAuthMiddleware = require("./middlewares/socketAuth");

const server = http.createServer(app);

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ✅ global access
global.io = io;

// 🟢 ONLINE USERS TRACKING
const onlineUsers = new Map(); // userId -> socketId

// ✅ auth
io.use(socketAuthMiddleware);

// ✅ connection
io.on("connection", (socket) => {
  const user = socket.user;

  console.log("🟢 Connected:", user.id);

  // ✅ JOIN ROOMS
  socket.join(`user_${user.id}`);
  socket.join(`role_${user.role}`);

  if (user.team) {
    socket.join(`team_${user.team}`);
  }

  // ✅ TRACK ONLINE USER
  onlineUsers.set(user.id, socket.id);

  // 🔥 BROADCAST ONLINE USERS
  io.emit("online_users", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", user.id);

    onlineUsers.delete(user.id);

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

// ✅ start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});