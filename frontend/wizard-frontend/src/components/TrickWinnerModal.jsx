import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styling/TrickWinnerModal.css"

export default function TrickWinnerModal({
  trickWinner,
  winningCard,
  endOfRound,
  setTrickWinner,
  setWinningCard,
  setShowScoreboard,
  setEndOfRound,
  setShowTrickWinnerModal,
  showTrickWinnerModal,
}) {
  const [lockedWinner, setLockedWinner] = useState(null);
  const [lockedWinningCard, setLockedWinningCard] = useState(null);

  useEffect(() => {
    if (trickWinner && !showTrickWinnerModal) {
      setLockedWinner(trickWinner);
      setLockedWinningCard(winningCard);
      setShowTrickWinnerModal(true);
    }
  }, [trickWinner, winningCard, showTrickWinnerModal]);

  function formatCardValue(value) {
    if (value === 11) return "Jack";
    if (value === 12) return "Queen";
    if (value === 13) return "King";
    if (value === 14) return "Ace";

    return value;
  }

  if (!lockedWinner || !showTrickWinnerModal || !lockedWinningCard) {
    return null;
  }
  let specialText = null;
  if (lockedWinningCard.value === 15) {
    specialText = "Wizard";
  } else if (lockedWinningCard.value === 1) {
    specialText = "Jester";
  }
  const cardTextDisplay =
    lockedWinningCard.suit === null
      ? specialText
      : `${formatCardValue(lockedWinningCard.value)} of ${lockedWinningCard.suit}`;

  return (
    <div className="modal-overlay">
      <dialog className="trick-winner-modal" open={showTrickWinnerModal}>
        <motion.div
          initial={{ y: -300, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
        >
          <p className="modal-text">
            {lockedWinner?.name} won the trick with a {cardTextDisplay}!!
          </p>
        </motion.div>
        <button
          className="modal-btn"
          onClick={() => {
            setShowTrickWinnerModal(false);
            setTrickWinner(null);
            setLockedWinner(null);
            setWinningCard(null);
            setLockedWinningCard(null);

            if (endOfRound) {
              setShowScoreboard(true);
              setEndOfRound(false);
            }
          }}
        >
          {endOfRound ? "Show Scoreboard" : "OK"}
        </button>
      </dialog>
    </div>
  );
}
