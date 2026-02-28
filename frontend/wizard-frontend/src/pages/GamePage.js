import { useState, useEffect, useRef } from "react";
import Card from "../components/Card.jsx";
import { useParams } from "react-router-dom";
import socket from "../socket.js";
import "../styling/GamePage.css";

export default function GamePage() {
    const containerRef = useRef(null);
    const [radii, setRadii] = useState({rx: 300, ry: 200});
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

    useEffect(() => {
        function updateRadii() {
            if (!containerRef.current) {
                return;
            }

            const {width, height} = containerRef.current.getBoundingClientRect();
            const rx = width * 0.38;
            const ry = height * 0.45;

            setRadii({rx, ry});
        }

        updateRadii();
        window.addEventListener("resize", updateRadii);
        return () => window.removeEventListener("resize", updateRadii);
    }, [])

    const opponents = players.filter(p => p.socketId !== socket.id);

    function getOpponentPosition(index, total) {
        const angle = ((Math.PI / (total-1)) * index);
        const x = -Math.cos(angle) * (radii.rx);
        const y = -Math.sin(angle) * radii.ry;
        
        return {x, y, angle};
    }

    function renderOpponent(player, index) {
        const {x, y, angle} = getOpponentPosition(index, opponents.length);
        const rotation = (angle * 180) / Math.PI + 90;
        return (
            <div className = "opponent-hand"
            key = {player.socketId}
            style = {{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -15%) translate(${x}px, ${y}px)`,
                transformOrigin: "center center"
            }}
            >
                <p>{player.name}</p>
                <div style = {{display: "flex",
                    gap: 1,
                    transform: `rotate(${rotation}deg)`
                }}>
                    {Array.from({length: player.cardCount}).map((_, i) => (
                        <Card key ={i} inPlayersHand = {false} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className = "game-container" ref = {containerRef}>
            <div className = "table-center">

            </div>

            {opponents.map(renderOpponent)}

            <div className = "player-hand">
                {hand.map((card, index) => {
                    const middle = hand.length / 2;
                    const rotation = (index - middle) * 4;
                    return (
                        <Card
                            key = {index}
                            suit = {card.suit}
                            value = {card.value}
                            inPlayersHand={true}
                            index = {index}
                            rotation = {rotation}
                        />
                    )
                })}
            </div>
        </div>
    )
}