import { useState, useEffect, useRef } from "react";
import React from "react";
import Card from "../components/Card.jsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import socket from "../socket.js";
import "../styling/GamePage.css";
import { useAuth } from "../context/authContext.js";
import BidSelection from "../components/BidSelection.jsx";
import ScoreBoard from "../components/ScoreBoard.jsx";
import PlayerInfocard from "../components/PlayerInfocard.jsx";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";

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
  const [showModal, setShowModal] = useState(true);
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
      setGameComplete(game.status === "complete");
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
    });

    return () => {
      socket.off("gameAbandoned");
      socket.off("gameLeft");
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

    const rotation = (cardsPos.angle * 180) / Math.PI + 90;

    return (
      <React.Fragment key={player.socketId}>
        <div
          className = "opponent-infocard"
          style={{transform: `translate(-50%, 50%) translate(${cardsPos.x}px, ${cardsPos.y}px)`}}
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
          style={{transform: `translate(-50%, 10%) translate(${cardsPos.x}px, ${cardsPos.y}px)`}}
        >
          <div
            className="rotation-handler"
            style={{transform: `rotate(${rotation}deg)`}}
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
    const layoutKey = `card-${card.value}-of-${card.suit}-${card.identifier}`

    return (
      <motion.div
        key={layoutKey} 
        layoutId={layoutKey}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          zIndex: index,
        }}
        initial={{opacity: 0, y: 40, scale: 0.9, x: offsetX}}
        animate={{
          opacity: 1,
          y: "-50%",
          scale: 1,
          x: offsetX,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <Card
          suit={card.suit}
          value={card.value}
          inPlayersHand={false}
          isPlayed={true}
          identifier={card.identifier}
        />
      </motion.div>
    );
  }

  function renderTrumpCard() {
    if (trump !== null) {
      return (
        <motion.div
          className="trump-display"
          initial={{ y: -300, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
        >
          <div className="trump-label">TRUMP</div>
          <Card
            style={{
              transform: "scale(0.5)",
              transformOrigin: "center",
            }}
            key={"trump"}
            suit={trump?.suit}
            value={trump?.value}
            inPlayersHand={false}
            isPlayed={true}
          />
        </motion.div>
      );
    }
    return null;
  }

  function renderTurnNotification() {
    if (isMyTurn) {
      return (
        <motion.div
          className={"scoreboard-wrapper"}
          initial={{ y: 200, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 10,
            duration: 0.5,
          }}
        >
          <h1 className="turn-notification">YOUR TURN</h1>
        </motion.div>
      );
    }
    return null;
  }

  function renderBidPopup() {
    if (isMyTurn && bid === -1) {
      return (
        <motion.div
          className={"scoreboard-wrapper"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BidSelection maxBid={roundNumber} gameId={gameId} />
        </motion.div>
      );
    }
    return null;
  }

  function renderWinnerPopup() {
    if (!winner) {
      return null;
    }

    return (
      <motion.div
        className="winner-overlay"
        initial={{ y: -300, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
      >
        <div className="winner-popup">{winner?.name} won the trick!!</div>
      </motion.div>
    );
  }

  function renderScoreBoard() {
    return (
      <motion.div
        className={"scoreboard-wrapper"}
        key={`scoreboard-${roundNumber}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ScoreBoard
          gameId={gameId}
          players={players}
          currentRound={roundNumber}
          gameComplete={gameComplete}
        />
      </motion.div>
    );
  }

  function renderFinalWinner() {
    if (!gameComplete) {
      return null;
    }

    const overallWinner = players.reduce((prev, current) =>
      prev.score > current.score ? prev : current,
    );

    return (
      <dialog className="modal" open={showModal}>
        <motion.div
          initial={{ y: -300, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
        >
          <p className="modalText">
            {overallWinner.name} Won the Game With A Score of{" "}
            {overallWinner.score}!
          </p>
        </motion.div>
        <button className="closeModal" onClick={() => setShowModal(false)}>
          Close
        </button>
      </dialog>
    );
  }

  async function handleLeave() {
    socket.emit("abandonGame", { gameId });
  }

  return (
    <div className="game-container" ref={containerRef}>
      <button onClick={handleLeave}>Leave Game</button>
      <div className="table-center"></div>

      {opponents && opponents.map(renderOpponent)}

      <LayoutGroup>
        <div className="trick-area">
          {trick?.map((card, index) => renderTrickCard(card, index))}
        </div>

        <div>{renderBidPopup()}</div>

        <div className="trump-card">
          {renderTrumpCard()}
        </div>

        <div className="player-area">
          {renderTurnNotification()}
          <div className="infocard" style={{ fontWeight: "bold" }}>
            <PlayerInfocard
              username={userData.username}
              avatarUrl={userData.profilePicture}
              bidsMade={bid}
              tricksTaken={tricksTaken}
            />
          </div>
          <div className="player-hand">
            <AnimatePresence>
              {hand.map((card, index) => {
                const middle = hand.length / 2;
                const rotation = (index - middle) * 4;
                const layoutKey = `card-${card.value}-of-${card.suit}-${card.identifier}`
                return (
                  <motion.div
                    key={layoutKey}
                    layoutId={layoutKey}
                    exit={{ opacity: 0, y: -20 }}
                    className="hand-animation"
                    style={{marginLeft: index === 0 ? "0" : "-100px",}}
                  >
                    <Card
                      suit={card.suit}
                      value={card.value}
                      inPlayersHand={true}
                      isValidPlay={card.isValid}
                      isBidPhase={bid === -1}
                      index={index}
                      rotation={rotation}
                      gameId={gameId}
                      isMyTurn={isMyTurn}
                      hand={hand}
                      id={card.id}
                      identifier={card.identifier}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
      {renderWinnerPopup()}
      {renderScoreBoard()}
      {renderFinalWinner()}
    </div>
  );
}
