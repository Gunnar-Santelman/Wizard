import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "./socket";


export default function LobbyPage() {
    const {gameId} = useParams();
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    function handleLeave() {
        socket.emit("leaveGame", {gameId});
        navigate("/");
    }
    function handleStartButton() {
        socket.emit("startGame", {gameId});
    }
    
    useEffect(() => {
        socket.emit("requestGameState", { gameId });

        function handleGameState(game) {
            setPlayers(game.players);
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
            socket.off("gameStarted", handleStart)
        }
    }, [navigate]);

    return (
        <div style ={{padding : 40}}>
            <h2>Game: {gameId}</h2>

            <h3>{players.length} Players:</h3>
            <ul>
                {players.map((p) => (
                    <li key = {p.socketId}>{p.name}</li>
                ))}
            </ul>

            <button onClick = {handleStartButton} disabled={players.length < 3}>
                Start Game
            </button>

            <button onClick= {handleLeave}>
                Leave Game
            </button>
        </div>
    );
}