import http from "http";
import app from "./app";
import { Server } from "socket.io";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("new-message", (payload) => {
    io.to(payload.threadId).emit("message", payload);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
