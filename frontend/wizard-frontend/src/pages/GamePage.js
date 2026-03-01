import { useState, useEffect, useRef } from "react";
import React from "react";
import Card from "../components/Card.jsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";
import "../styling/GamePage.css";

export default function GamePage() {
  const containerRef = useRef(null);
  const [radii, setRadii] = useState({ rx: 300, ry: 200 });
  const { gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [trick, setTrick] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("requestGameState", { gameId });

    function handleGameState(game) {
      setPlayers(game.players);
      setHand(game.hand);
      setTrick(game.trick);
    }

    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, [gameId]);

  useEffect(() => {
    socket.on("gameEnded", () => {
      alert("A player left the game!");
      navigate("/");
    });

    return () => {
      socket.off("gameEnded");
    };
  }, [navigate]);

  useEffect(() => {
    function updateRadii() {
      if (!containerRef.current) {
        return;
      }

      const { width, height } = containerRef.current.getBoundingClientRect();
      const rx = width * 0.38;
      const ry = height * 0.45;

      setRadii({ rx, ry });
    }

    updateRadii();
    window.addEventListener("resize", updateRadii);
    return () => window.removeEventListener("resize", updateRadii);
  }, []);

  const opponents = players.filter((p) => p.socketId !== socket.id);

  function getOpponentPosition(index, total, radiusX, radiusY) {
    const angle = (Math.PI / (total - 1)) * index;
    const x = -Math.cos(angle) * radiusX;
    const y = -Math.sin(angle) * radiusY;

    return { x, y, angle };
  }

  function renderOpponent(player, index) {
    const cardsPos = getOpponentPosition(
      index,
      opponents.length,
      radii.rx,
      radii.ry,
    );
    const nameOffset = 150;
    const namePos = getOpponentPosition(
      index,
      opponents.length,
      radii.rx + nameOffset,
      radii.ry + nameOffset / 8,
    );
    const rotation = (cardsPos.angle * 180) / Math.PI + 90;

    return (
      <React.Fragment key={player.socketId}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, 10%) translate(${namePos.x}px, ${namePos.y}px)`,
            textAlign: "center",
            fontWeight: "bold",
            pointerEvents: "none",
          }}
        >
          {player.name}
        </div>
        <div
          className="opponent-hand"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, 10%) translate(${cardsPos.x}px, ${cardsPos.y}px)`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 1,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {Array.from({ length: player.cardCount }).map((_, i) => (
              <Card key={i} inPlayersHand={false} />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  function renderTrickCard(card, index) {
    const total = trick.length;
    const spacing = 60;
    const offsetX = (index - (total - 1) / 2) * spacing;

    return (
      <div key = {index}
        style = {{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${offsetX}px, 0px)`,
          transition: "all 0.3s ease",
          zIndex: index
        }}
      >
        <Card
          suit = {card.suit}
          value = {card.value}
          inPlayersHand = {false}
          isPlayed = {true}/>
      </div>
    )
  }

  async function handleLeave() {
    socket.emit("leaveGame", { gameId });
  }

  return (
      <div className="game-container" ref={containerRef}>
        <button onClick={handleLeave}>Leave Game</button>
        <div className="table-center"></div>

        {opponents && opponents.map(renderOpponent)}

        <div className = "trick-area">
          {trick?.map((card, index) => 
            renderTrickCard(card, index)
          )}
        </div>

        <div className="player-hand">
          {hand.map((card, index) => {
            const middle = hand.length / 2;
            const rotation = (index - middle) * 4;
            return (
              <Card
                key={index}
                suit={card.suit}
                value={card.value}
                inPlayersHand={true}
                index={index}
                rotation={rotation}
              />
            );
          })}
        </div>
      </div>
  );
}
