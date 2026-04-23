import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, signout } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/authContext";
import { getToken } from "../services/authService";
import { createGame } from "../services/gameService";
import "../styling/Home.css"
import socket from "../socket";

export default function Home() {
  const { userData } = useAuth();

  const [gameId, setGameId] = useState("");
  const navigate = useNavigate();
  const playerName = userData?.username;

  async function handleCreate() {
    if (!playerName) return;
    const game = await createGame();

    socket.emit("joinGame", {
      gameId: game.id,
      token: await getToken(),
    });

    navigate(`/lobby/${game.id}`, {
      state: { playerName },
    });
  }

  async function handleJoin() {
    if (!playerName) return;
    socket.emit("joinGame", {
      gameId,
      token: await getToken(),
    });
  }

  useEffect(() => {
    function handleSuccess({ gameId }) {
      navigate(`/lobby/${gameId}`, {
        state: { playerName },
      });
    }
    function handleError(message) {
      alert(message);
    }

    socket.on("joinSuccess", handleSuccess);
    socket.on("joinError", handleError);

    return () => {
      socket.off("joinSuccess", handleSuccess);
      socket.off("joinError", handleError);
    };
  }, [navigate, playerName]);

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <button className="quarternary-btn" id = "tutorial" onClick={() => navigate("/tutorial")}>Tutorial</button>
        <button className="quarternary-btn" id = "profile" onClick={() => navigate("/profile")}>Profile</button>
        <h1 className="title">Wizard</h1>

        <button className = "primary-btn" onClick={handleCreate}>Create Game</button>
        
        <div className="divider">or</div>

        <input
          value={gameId}
          className = "game-input"
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Game Code"
        />

        <button className = "secondary-btn" onClick={handleJoin}>Join Game</button>
        <button className = "tertiary-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
