import app from "./app.js";
import connectDB from "./db.js";
import http from "http";
import { Server } from "socket.io"

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("pingTest", (data) => {
    console.log("Received from client:", data);
    socket.emit("pongTest", "Hello from server");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () =>{
  console.log("Server running on port 5000");
});


