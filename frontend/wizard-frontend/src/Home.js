import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import * as gameApi from "./api/gameApi";
import socket from "./socket";

function generatePlayerName() {
    return "Player_" + Math.floor(Math.random() * 10000);
}

export default function Home() {
    const [gameId, setGameId] = useState("");
    const navigate = useNavigate();
    const [playerName] = useState(() => generatePlayerName());

    async function handleCreate() {
        const game = await gameApi.createGame();

        socket.emit("joinGame", {
            gameId: game.id,
            playerName
        });

        navigate(`/lobby/${game.id}`, {
            state: {playerName}
        });
    }

    function handleJoin() {
        socket.emit("joinGame", {
            gameId,
            playerName
        });
    }

    useEffect(() => {
        function handleSuccess({gameId}) {
            navigate(`/lobby/${gameId}`, {
                state: {playerName}
            });
        }
        function handleError(message) {
            alert(message);
        }

        socket.on("joinSuccess", handleSuccess);
        socket.on("joinError", handleError);

        return () => {
            socket.off("joinSuccess",handleSuccess);
            socket.off("joinError", handleError);
        };
    }, [navigate, playerName]);

    return (
        <div style ={{padding: 40}}>
            <h2>Wizard Lobby</h2>

            <button onClick={handleCreate}>Create Game</button>

            <hr />

            <input 
                value = {gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Game Code"
            />
            <button onClick={handleJoin}>Join Game</button>
        </div>
    )
}