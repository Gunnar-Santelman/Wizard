import logo from './logo.svg';
import './App.css';


import * as gameApi from "./api/gameApi.js";
import { useEffect, useState } from 'react';
import socket from "./socket";
import {Routes, Route} from "react-router-dom";
import Home from "./Home";
import GamePage from "./GamePage";

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/game/:gameId" element = {<GamePage />} />
    </Routes>
  );
  // const [playerName] = useState(generatePlayerName());
  // const [gameId, setGameId] = useState("");
  // const [status, setStatus] = useState("Not connected");

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected:", socket.id);
  //   });

  //   socket.on("playerJoined", (data) => {
  //     setStatus(`${data.playerName} joined the game`);
  //     console.log("Player joined:", data);
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("playerJoined");
  //   };
  // }, []);

  // async function handleCreateGame() {
  //   const game = await gameApi.createGame();
  //   console.log("Game created:", game);

  //   setGameId(game.id);

  //   socket.emit("joinGame", {
  //     gameId: game.id,
  //     playerName,
  //   });

  //   setStatus(`Created and joined game ${game.id}`);
  // }

  // function handleJoinGame() {
  //   if (!gameId) {
  //       return;
  //   }

  //   socket.emit("joinGame", {
  //     gameId,
  //     playerName,
  //   });

  //   setStatus(`Joining game ${gameId}...`);
  // }

  // return (
  //   <div style = {{padding: 40}}>
  //     <h2>Wizard Game Lobby</h2>
  //     <p><strong>Your Name:</strong> {playerName}</p>
      
  //     <hr />

  //     <button onClick={handleCreateGame}>
  //       Create Game
  //     </button>

  //     <input
  //       type = "text"
  //       placeholder='Enter Game Code'
  //       value={gameId}
  //       onChange={(e) => setGameId(e.target.value)}
  //     />

  //     <button onClick={handleJoinGame}>
  //       Join Game
  //     </button>

  //     <hr />
      
  //     <p><strong>Status</strong> {status}</p>
  //   </div>
  // );
}

export default App;
