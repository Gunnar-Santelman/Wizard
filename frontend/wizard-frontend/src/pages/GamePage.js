import { useState, useEffect, useRef } from "react";
import React from "react";
import Card from "../components/Card.jsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";
import "../styling/GamePage.css";
import { useAuth } from "../context/authContext.js";
import BidSelection from "../components/BidSelection.jsx";
import ScoreBoard from "../components/ScoreBoard.jsx"
import PlayerInfocard from "../components/PlayerInfocard.jsx";

export default function GamePage() {

  const { userData } = useAuth();

  const containerRef = useRef(null);
  const [radii, setRadii] = useState({ rx: 300, ry: 200 });
  const { gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [trick, setTrick] = useState([]);
  const [trump, setTrump] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [bid, setBid] = useState(-1);
  const [tricksTaken, setTricksTaken] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("requestGameState", { gameId });

    function handleGameState(game) {
      setPlayers(game.players);
      setHand(game.hands?.[socket.id] || []);
      setTrick(game.trick || []);
      setTrump(game.trumpCard || null);
      setIsMyTurn(game.currentPlayer === socket.id);
      setWinner(game.winner || null);
      setRoundNumber(game.roundNumber || 0);
      setBid(game.players.find((p) => p.socketId === socket.id).bidAmount);
      setTricksTaken(
        game.players.find((p) => p.socketId === socket.id).tricksTaken,
      );
      setGameComplete((game.status === "complete"));
    }
    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, [gameId]);

  useEffect(() => {
    socket.on("gameAbandoned", () => {
      alert("A player left the game!");
      navigate("/");
    });
    socket.on("gameLeft", () => {
      navigate("/");
    })

    return () => {
      socket.off("gameAbandoned");
      socket.off("gameLeft")
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

  useEffect(() => {
    if (!winner) {
      return;
    }
    
    const timer = setTimeout(() => {
      setWinner(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [winner]);

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
    const offset = 220;
    const perpAngle = cardsPos.angle + Math.PI / 2;
    const namePos = {
      x: cardsPos.x + Math.cos(perpAngle) * offset,
      y: cardsPos.y + Math.sin(perpAngle) * offset,
    };

    const rotation = (cardsPos.angle * 180) / Math.PI + 90;

    return (
      <React.Fragment key={player.socketId}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, 10%) translate(${cardsPos.x}px, ${cardsPos.y}px)`,
            textAlign: "center",
            fontWeight: "bold",
            pointerEvents: "none",
            color: "white",
            zIndex: "100"
          }}
        >
          <PlayerInfocard
            username={player.name}
            avatarUrl={player.profilePicture}
            bidsMade={player.bidAmount}
            tricksTaken={player.tricksTaken}
          ></PlayerInfocard>
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
              gap: 0,
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
      <div
        key={index}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${offsetX}px, 0px)`,
          transition: "all 0.3s ease",
          zIndex: index,
        }}
      >
        <Card
          suit={card.suit}
          value={card.value}
          inPlayersHand={false}
          isPlayed={true}
        />
      </div>
    );
  }

  function renderTrumpCard() {
    if (trump !== null) {
      return (
        <div className="trump-display">
          <div className="trump-label">TRUMP</div>
          <Card
            style={{
              transform: 'scale(0.5)',
              transformOrigin: 'center'
            }}
            key={"trump"}
            suit={trump?.suit}
            value={trump?.value}
            inPlayersHand={false}
            isPlayed={true}
          />
        </div>
        );
    }
    return null;
  }

  function renderTurnNotification() {
    if (isMyTurn) {
      return <h1 className="turn-notification">YOUR TURN</h1>;
    }
    return null;
  }

  function renderBidPopup() {
    if (isMyTurn && bid === -1) {
      return <BidSelection maxBid={roundNumber} gameId={gameId} />;
    }
    return null;
  }

  function renderWinnerPopup() {
    if (!winner) {
      return null;
    }

    return (
      <div className="winner-overlay">
        <div className="winner-popup">{winner?.name} won the trick!!</div>
      </div>
    );
  }

  function renderScoreBoard(){
    return (
      <div>
        <ScoreBoard gameId={gameId} players={players} currentRound={roundNumber} gameComplete={gameComplete}/>
      </div>
    )
  }

  function renderFinalWinner() {
    if (!gameComplete) {
      return null;
    }

    const overallWinner = players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    const modal = document.querySelector(".modal");
    const closeModal = document.querySelector(".closeModal");
    closeModal.addEventListener("click", () => {
      modal?.close();
    });
    return (
      <dialog className="modal" open>
        <p className="modalText"> {overallWinner.name} Won the Game With A Score of {overallWinner.score}!</p>
        <button className="closeModal">Close</button>
      </dialog>
    )
  }

  async function handleLeave() {
    socket.emit("abandonGame", { gameId });
  }

  return (
    <div className="game-container" ref={containerRef}>
      <button onClick={handleLeave}>Leave Game</button>
      <div className="table-center"></div>

      {opponents && opponents.map(renderOpponent)}

      <div className="trick-area">
        {trick?.map((card, index) => renderTrickCard(card, index))}
      </div>

      <div>{renderBidPopup()}</div>
      
      <div
        className="trump-card"
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)'
          }}
      >
        {renderTrumpCard()}
      </div>
      
      <div className="player-area">
        {renderTurnNotification()}
        <div className = "infocard" style={{fontWeight: "bold"}}>
          <PlayerInfocard
            username={userData.username}
            avatarUrl={userData.profilePicture}
            bidsMade={bid}
            tricksTaken={tricksTaken}
          />
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
                isValidPlay={card.isValid}
                isBidPhase={bid === -1}
                index={index}
                rotation={rotation}
                gameId={gameId}
                isMyTurn={isMyTurn}
              />
            );
          })}
        </div>
      </div>
      {renderWinnerPopup()}
      {renderScoreBoard()}
      {renderFinalWinner()}
    </div>
  );
}
