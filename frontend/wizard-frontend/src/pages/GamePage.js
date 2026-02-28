import { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import { useParams } from "react-router-dom";
import socket from "../socket.js";
import "../styling/GamePage.css";

export default function GamePage() {
    const {gameId} = useParams();
    const [players, setPlayers] = useState([]);
    const [hand, setHand] = useState([]);

    useEffect(() => {
        socket.emit("requestGameState", {gameId});

        function handleGameState(game) {
            setPlayers(game.players);
            setHand(game.hand);
        }

        socket.on("gameState", handleGameState);

        return() => {
            socket.off("gameState", handleGameState);
        }
    }, [gameId]);


    const opponents = players.filter(p => p.socketId !== socket.id);

    function getOpponentPosition(index, total) {
        const angle = ((Math.PI / (total-1)) * index);
        const radius = 300;
        const x = -Math.cos(angle) * radius;
        const y = -Math.sin(angle) * radius;
        
        return {x, y, angle};
    }

    function renderOpponent(player, index) {
        const {x, y, angle} = getOpponentPosition(index, opponents.length);
        const rotation = (angle * 180) / Math.PI + 90;
        return (
            <div
            key = {player.socketId}
            style = {{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                transformOrigin: "center center"
            }}
            >
                <p>{player.name}</p>
                <div style = {{display: "flex", gap: 1}}>
                    {Array.from({length: player.cardCount}).map((_, i) => (
                        <Card key ={i} inPlayersHand = {false} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className = "game-container">
            <div className = "table-center">

            </div>

            {opponents.map(renderOpponent)}

            <div className = "player-hand">
                {hand.map((card, index) => (
                    <Card
                        key = {index}
                        suit = {card.suit}
                        value = {card.value}
                        inPlayersHand={true}
                    />
                ))}
            </div>
        </div>
    )
}