import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "./socket";


export default function GamePage() {
    const {gameId} = useParams();
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    function handleLeave() {
        socket.emit("leaveGame", {gameId});
        navigate("/");
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

    return (
        <div style ={{padding : 40}}>
            <h2>Game: {gameId}</h2>

            <h3>Players:</h3>
            <ul>
                {players.map((p) => (
                    <li key = {p.socketId}>{p.name}</li>
                ))}
            </ul>

            <button onClick= {handleLeave}>
                Leave Game
            </button>
        </div>
    );
}