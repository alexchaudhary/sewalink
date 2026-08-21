import http from "http";
import app from "./app";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = http.createServer(app);

// Allowed origins setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter((url): url is string => Boolean(url));

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Socket CORS Policy: Access Denied"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("join-room", (room: string) => {
    if (room) {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    }
  });

  socket.on("new-message", (payload: { threadId: string; message: any }) => {
    if (payload?.threadId) {
      io.to(payload.threadId).emit("message", payload);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Socket disconnected: ${socket.id} (Reason: ${reason})`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});