import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "../styling/LobbyPage.css"

export default function LobbyPage() {
  const { gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);
  const isHost = host?.socketId === socket.id;
  const navigate = useNavigate();

  function handleLeave() {
    socket.emit("leaveLobby", { gameId });
    navigate("/");
  }
  function handleStartButton() {
    socket.emit("startGame", { gameId });
  }

  useEffect(() => {
    socket.emit("requestGameState", { gameId });

    function handleGameState(game) {
      setPlayers(game.players);
      setHost(game.host);
    }

    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, [gameId]);

  useEffect(() => {
    function handleStart() {
      navigate(`/game/${gameId}`);
    }

    socket.on("gameStarted", handleStart);

    return () => {
      socket.off("gameStarted", handleStart);
    };
  }, [navigate, gameId]);

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1 className="lobby-title">Game Code</h1>
        <div className="game-id">{gameId}</div>

        <div className="players-section">
          <h3>{players.length} Players:</h3>
          <ul className="player-list">
            {players.map((p) => (
              <li
                key={p.socketId}
                className={`player-item ${
                  p.socketId === host?.socketId ? "host" : ""
                }`}
              >
                {p.name}
                {p.socketId === host?.socketId && (
                  <span className="host-badge">HOST</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="lobby-actions">
          <button
            className="start-btn"
            onClick={handleStartButton}
            disabled={players.length < 3 || !isHost}
          >
            Start Game
          </button>

          <button className = "leave-btn" onClick={handleLeave}>Leave Game</button>
        </div>
      </div>
    </div>
  );
}
