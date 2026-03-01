import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../socket";


export default function LobbyPage() {
    const {gameId} = useParams();
    const [players, setPlayers] = useState([]);
    const [host, setHost] = useState([]); 
    const isHost = host === socket.id;
    const navigate = useNavigate();

    function handleLeave() {
        socket.emit("leaveLobby", {gameId});
        navigate("/");
    }
    function handleStartButton() {
        socket.emit("startGame", {gameId});
    }
    function listPlayer(player) {
        if (player.socketId === host) {
            return <li key = {player.socketId}>Host: {player.name}</li>
        }
        else {
            return <li key = {player.socketId}>{player.name}</li>
        }
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
            socket.off("gameStarted", handleStart)
        }
    }, [navigate,gameId]);

    return (
        <div style ={{padding : 40}}>
            <h2>Game: {gameId}</h2>

            <h3>{players.length} Players:</h3>
            <ul>
                {players.map((p) => (
                    listPlayer(p)
                ))}
            </ul>

            <button onClick = {handleStartButton} disabled={players.length < 3 || !isHost}>
                Start Game
            </button>

            <button onClick= {handleLeave}>
                Leave Game
            </button>
        </div>
    );
}