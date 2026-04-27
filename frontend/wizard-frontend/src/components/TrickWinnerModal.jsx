import {useState, useEffect} from "react";
import { motion } from "framer-motion";

export default function TrickWinnerModal({
  trickWinner,
  winningCard,
  endOfRound,
  setTrickWinner,
  setWinningCard,
  setShowScoreboard,
  setEndOfRound,
  setShowTrickWinnerModal,
  showTrickWinnerModal
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
      : `${lockedWinningCard.value} of ${lockedWinningCard.suit}`;

  return (
    <dialog className="modal" open={showTrickWinnerModal}>
      <motion.div
        initial={{ y: -300, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
      >
        <p className="modal-text">
          {lockedWinner?.name} won the trick with a {cardTextDisplay}!!
        </p>
      </motion.div>
      <button
        className="closeModal"
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
  );
}
