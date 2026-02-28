import app from "./app.js";
import connectDB from "./db.js";
import http from "http";
import { Server } from "socket.io"
import GameManager from "./game/GameManager.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("joinGame", ({ gameId, playerName }) => {
    const game = GameManager.getGame(gameId);

    if (!game) {
      socket.emit("joinError", "Game not found");
      return;
    }
    if (game.getGameState().players.length == 6) {
      socket.emit("joinError", "Game already full");
      return;
    }
    if (game.getGameState().status === "running") {
      socket.emit("joinError", "Game already started");
      return;
    }

    socket.join(gameId);
    game.joinGame(playerName, socket.id);

    socket.emit("joinSuccess", {gameId});

    io.to(gameId).emit("gameState", game.getGameState())
  });

  socket.on("requestGameState", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    const player = game.players.find(
      p => p.socketId === socket.id
    );

    socket.emit("gameState", {
      players: game.players.map(p => ({
        socketId:p.socketId,
        name: p.name,
        cardCount: p.hand.length
      })),
      hand: player ? player.hand : [],
      host: game.host,
      status: game.status,
      currentRound: game.currentRound
    })
    // socket.emit("gameState", game.getGameState());
  });

  socket.on("leaveGame", ({gameId}) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    game.removePlayer(socket.id);

    io.to(gameId).emit("gameState", game.getGameState());
    if (game.isEmpty()) {
      GameManager.deleteGame(gameId);
    }
  });

  socket.on("startGame", ({gameId}) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    game.status = "running";

    io.to(gameId).emit("gameStarted", {gameId});
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for(const [id, game] of GameManager.activeGames) {
      const originalLength = game.players.length;

      game.removePlayer(socket.id);

      if (game.players.length !== originalLength) {
        io.to(id).emit("gameState", game.getGameState());
      }

      if (game.isEmpty()) {
        GameManager.deleteGame(id);
      }
    }
  });
});

server.listen(PORT, () =>{
  console.log("Server running on port 5000");
});


