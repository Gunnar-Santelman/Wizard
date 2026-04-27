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

// creates the UI for the central game page within which Wizard is played
export default function GamePage() {
  // retrieves userData for usernames
  const { userData } = useAuth();

  // various useStates that allow updating of parts of the screen
  const containerRef = useRef(null);
  const [radii, setRadii] = useState({ rx: 300, ry: 200 });
  const { gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [trick, setTrick] = useState([]);
  const [trump, setTrump] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [trickWinner, setTrickWinner] = useState(null);
  const [winningCard, setWinningCard] = useState(null);
  const [showTrickWinnerModal, setShowTrickWinnerModal] = useState(false);
  const [endOfRound, setEndOfRound] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [bid, setBid] = useState(-1);
  const [tricksTaken, setTricksTaken] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // allows navigation away from the GamePage
  const navigate = useNavigate();

  // retrieves gameState from backend and sets necessary variables
  useEffect(() => {
    socket.emit("requestGameState", { gameId });

    function handleGameState(game) {
      setPlayers(game.players);
      setHand(game.hands?.[socket.id] || []);
      setTrick(game.trick || []);
      setTrump(game.trumpCard || null);
      setIsMyTurn(game.currentPlayer === socket.id);
      setRoundNumber(game.roundNumber || 0);
      setBid(game.players.find((p) => p.socketId === socket.id).bidAmount);
      setTricksTaken(
        game.players.find((p) => p.socketId === socket.id).tricksTaken,
      );
      setGameComplete(game.status === "complete");
      if (!endOfRound) {
        setTrickWinner(game.winner || null);
        setWinningCard(game.winningCard || null);
      }
    }
    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, [gameId]);

  // if a player leaves before the game is completed, the game is considered abandoned, and appropriate WebSocket signal is sent
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

  // determines size of screen to properly determine opponent card spacing(updates on changes to window size)
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
    if (trickWinner) {
      setShowTrickWinnerModal(true);
    }
  }, [trickWinner]);

  useEffect(() => {
  if (roundNumber !== 0 && roundNumber !== 1) {
    setEndOfRound(true);
  }
}, [roundNumber])

  // retrieves opponent data
  const opponents = players.filter((p) => p.socketId !== socket.id);
  // calculates the opponents position based on the size of the screen so they are properly arrayed around in a semi-circle
  function getOpponentPosition(index, total, radiusX, radiusY) {
    const angle = (Math.PI / (total - 1)) * index;
    const x = -Math.cos(angle) * radiusX;
    const y = -Math.sin(angle) * radiusY;

    return { x, y, angle };
  }

  // renders the opponent card backs, and the opponent's infocard, displaying necessary information
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
          className="opponent-infocard"
          style={{
            "--x": `${cardsPos.x}px`,
            "--y": `${cardsPos.y}px`,
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
            "--x": `${cardsPos.x}px`,
            "--y": `${cardsPos.y}px`,
          }}
        >
          <div
            className="rotation-handler"
            style={{
              "--rotation": `${rotation}deg`,
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

  // renders the trick cards that have currently been played in the center of the table
  function renderTrickCard(card, index) {
    const total = trick.length;
    const spacing = 60;
    const offsetX = (index - (total - 1) / 2) * spacing;

    return (
      <motion.div
        // slight animation to reduce how jarring the card playing is
        key={card.id}
        layoutId={card.id}
        className="trick-animation"
        style={{
          zIndex: index,
        }}
        initial={{ opacity: 0, y: 40, scale: 0.9, x: offsetX }}
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

  // renders and animates the trump card display in the top right corner of the screen
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
            className="trump-card-inner"
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

  // renders and animates the turn notification that appears beside an opponent's hand when it is their turn to play
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

  // creates the bid popup when it is time for the players to bid, and places it in the center of the screen
  function renderBidPopup() {
    if (isMyTurn && bid === -1 && !endOfRound) {
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
  // if a trick has just been completed, it renders the trick winner popup
  function renderTrickWinnerModal() {
    console.log(trickWinner);
    console.log(winningCard);
    console.log(showTrickWinnerModal);
    if (!trickWinner || !showTrickWinnerModal || !winningCard) {
      return null;
    }
    let specialText = null;
    if (winningCard.value === 15) {
      specialText = "Wizard";
    } else if (winningCard.value === 1) {
      specialText = "Jester";
    }
    const cardTextDisplay =
      winningCard.suit === null
        ? specialText
        : `${winningCard.value} of ${winningCard.suit}`;

    return (
      <dialog className="modal" open={showTrickWinnerModal}>
        <motion.div
          initial={{ y: -300, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
        >
          <p className="modal-text">
            {trickWinner?.name} won the trick with a {cardTextDisplay}!!
          </p>
        </motion.div>
        <button
          className="closeModal"
          onClick={() => {
            setShowTrickWinnerModal(false);
            setTrickWinner(null);

            if (endOfRound) {
              setShowScoreboard(true);
              setEndOfRound(false);
            }
          }}
        >
          {endOfRound ? "Show Scoreboard" : "OK"}
        </button>
      </dialog>
    );
  }

  // renders the scoreboard that will appear on screen following each round
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
          showScoreboard={showScoreboard}
          setShowScoreboard={setShowScoreboard}
        />
      </motion.div>
    );
  }

  // at the end of the game, creates a modal popup displaying the overall winner of the game and their score
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

  // handles a user pressing the leave game button prior to the end of the game
  async function handleLeave() {
    socket.emit("abandonGame", { gameId });
  }

  // the core of the page that renders the necessary elements of the table based on the current location of the gameplay
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

        <div className="trump-card">{renderTrumpCard()}</div>

        <div className="player-area">
          {renderTurnNotification()}
          <div className="infocard">
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
                // creates the actual player's hand in the bottom center of the screen
                const middle = hand.length / 2;
                const rotation = (index - middle) * 4;
                return (
                  <motion.div
                    // animates when the player plays a card to make it less jarring
                    key={card.id}
                    layoutId={card.id}
                    exit={{ opacity: 0, y: -20 }}
                    className={`hand-animation ${index === 0 ? "first-card" : ""}`}
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
      {renderTrickWinnerModal()}
      {renderScoreBoard()}
      {renderFinalWinner()}
    </div>
  );
}
