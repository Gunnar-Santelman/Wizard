import app from "./app.js";
import connectDB from "./db.js";
import http from "http";
import { Server } from "socket.io";
import { verifyToken } from "./middleware/auth.js";
import GameManager from "./game/GameManager.js";
import * as GameService from "./services/GameService.js";
import * as UserService from "./services/UserService.js";

// sets up the various WebSocket receivers
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

// occurs when a user first connects to the Wizard program
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // determines if a user can join a specific game; if they can, they are added in, else an error message is returned to the frontend
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

    // gets limited elements of the game state necessary for lobby creation
    io.to(gameId).emit("gameState", game.getGameState());
  });

  // retrieves all the elements of the game state to update the frontend
  socket.on("requestGameState", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    socket.emit("gameState", buildGameState(game));
  });

  // receives signal to play a card from the user's hand, and calls necessary functions
  socket.on("playCard", ({gameId, cardId}) => {
    const game = GameManager.getGame(gameId);
    if (!game || !game.currentRound) {
      return;
    }

    game.currentRound.playCard(socket.id, cardId);

    io.to(gameId).emit("gameState", buildGameState(game));

    // ensure that the winner of a trick is reset at the start of the next hand (ie next backend update)
    game.currentRound.winner = null;
  })

  // receives signal to place a bid from a user, and calls necessary backend functions
  socket.on("placeBid", ({gameId, bidAmount}) => {
    const game = GameManager.getGame(gameId);
    if (!game || !game.currentRound) {
      return;
    } 
    game.currentRound.placeBid(socket.id, bidAmount);
    
    io.to(gameId).emit("gameState", buildGameState(game));
  })

  // leaves the lobby, destroying the lobby if they were the only player
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

  // starts up the game at round 1, and sends necessary info to database and frontend
  socket.on("startGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    game.startGame();

    GameService.startGameDB(game);

    io.to(gameId).emit("gameStarted", { gameId });
  });

  // signal received if game is left early; game must be ended, kicks all other players back to home screen
  socket.on("abandonGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }

    io.to(game.id).emit("gameAbandoned");
    GameManager.deleteGame(game.id);
    return;
  });

  // signal received if game is left at the end of the game; doesn't kick other players to home screen
  socket.on("leaveGame", ({ gameId }) => {
    const game = GameManager.getGame(gameId);
    if (!game) {
      return;
    }
    
  socket.emit("gameLeft");
    game.removePlayer(socket.id);
    if (game.isEmpty()) {
      GameManager.deleteGame(game.id);
    }
    return;
  });

  // occurs when user closes page, and prevents unnecessary crashes
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

// combines all the lements to build the frontend; is returned to frontend whenever a signal is received by the backend to change an element
function buildGameState(game) {
  const players = game.players ?? [];

  return {
    id: game.id,
    status: game.status,
    players: players.map(p =>({
      socketId:p.socketId,
      name: p.name,
      profilePicture: p.profilePicture,
      cardCount: p.hand?.length ?? 0,
      bidAmount: p.bid ?? -1,
      tricksTaken: p.tricksTaken ?? 0,
      roundScores: p.roundScores,
      score: p.score ?? 0
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
    winningCard: game.currentRound?.winningCard || null,
  };
}


server.listen(PORT, () => {
  console.log("Server running on port 5000");
});
