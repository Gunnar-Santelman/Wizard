import app from "./app.js";
import connectDB from "./db.js";
import http from "http";
import { Server } from "socket.io";
import { verifyToken } from "./middleware/auth.js";
import GameManager from "./game/GameManager.js";
import * as GameService from "./services/GameService.js";
import * as UserService from "./services/UserService.js";

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinGame", async ({ gameId, token }) => {
    const uid = await verifyToken(token);
    const userInfo = await UserService.getAllUserInfo(uid);

    if (!userInfo) {
      socket.emit("joinError", "Invalid user token");
      return;
    }
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
    game.joinGame(userInfo.username, userInfo.profilePicture, socket.id, uid);
    GameManager.socketToGame[socket.id] = game.id;

    socket.emit("joinSuccess", { gameId });

    io.to(gameId).emit("gameState", game.getGameState());
  });

  socket.on("requestGameState", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    socket.emit("gameState", buildGameState(game));
  });

  socket.on("playCard", ({gameId, cardId}) => {
    const game = GameManager.getGame(gameId);
    if (!game || !game.currentRound) {
      return;
    }

    game.currentRound.playCard(socket.id, cardId);

    io.to(gameId).emit("gameState", buildGameState(game));

    game.currentRound.winner = null;
  })

  socket.on("placeBid", ({gameId, bidAmount}) => {
    const game = GameManager.getGame(gameId);
    if (!game || !game.currentRound) {
      return;
    } 
    game.currentRound.placeBid(socket.id, bidAmount);
    
    io.to(gameId).emit("gameState", buildGameState(game));
  })

  socket.on("leaveLobby", ({ gameId }) => {
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

  socket.on("startGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    game.startGame();

    await GameService.startGameDB(game);

    io.to(gameId).emit("gameStarted", { gameId });
  });

  socket.on("abandonGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }
    
    await GameService.abandonGameDB(game);

    io.to(game.id).emit("gameAbandoned");
    GameManager.deleteGame(game.id);
    return;
  });

  socket.on("leaveGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    await GameService.finishGameDB(game);
    
    socket.emit("gameLeft");
    game.removePlayer(socket.id);
    if (game.isEmpty()) {
      GameManager.deleteGame(game.id);
    }
    return;
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const gameId = GameManager.socketToGame[socket.id];
    if (!gameId) {
      return;
    }

    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    io.to(game.id).emit("gameAbandoned");
    GameManager.deleteGame(game.id);
    delete GameManager.socketToGame[socket.id];
    return;
  });
});

function buildGameState(game) {
  return {
    id: game.id,
    status: game.status,
    players: game.players.map(p =>({
      socketId:p.socketId,
      name: p.name,
      profilePicture: p.profilePicture,
      cardCount: p.hand.length,
      bidAmount: p.bid,
      tricksTaken: p.tricksTaken,
      roundScores: p.roundScores,
      score: p.score
    })),
    host: game.host,
    hands: game.players.reduce((acc, p) => {
      acc[p.socketId] = p.hand;
      return acc;
    }, {}),
    trick: game?.currentRound?.currentTrick?.cards.map(t=> ({
      suit: t.card.suit,
      value: t.card.value,
      playerId: t.playerId
    })) || [],
    roundNumber: game.currentRound?.roundNo || null,
    trumpCard: game.currentRound?.trumpCard || null,
    currentPlayer: game.currentRound?.currentPlayer?.socketId || null,
    winner: game.currentRound?.winner || null,
  };
}


server.listen(PORT, () => {
  console.log("Server running on port 5000");
});
