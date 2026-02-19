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
  
  socket.on("joinGame", ({ gameId, playerName }) => {
    console.log(`${playerName} joining ${gameId}`);

    socket.join(gameId);
    socket.emit("joinedGame", {
      message: "Succesfully joined game",
      gameId
    });

    socket.to(gameId).emit("playerJoined", {
      playerName
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () =>{
  console.log("Server running on port 5000");
});


