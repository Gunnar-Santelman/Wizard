import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { signOut, signout } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/authContext";
import { createGame } from "../services/gameService";
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
            playerName,
            profilePicture: userData?.profilePicture
        });

        navigate(`/lobby/${game.id}`, {
            state: {playerName}
        });
    }

    function handleJoin() {
        if (!playerName) return;
        socket.emit("joinGame", {
            gameId,
            playerName,
            profilePicture: userData?.profilePicture
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

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <div style ={{padding: 40}}>

            <button onClick={handleLogout}>Logout</button>

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