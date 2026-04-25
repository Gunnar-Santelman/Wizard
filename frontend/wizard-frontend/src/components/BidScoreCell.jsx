import { useState } from "react";
import "BidScoreCell.css"

// For use in ScoreBoard if you want to display a prior round's bids made/tricks taken in addition to score

export default function BidScoreCell({
  tricksTaken = 2,
  bidsMade = 4,
  score = -20
}) {

  return (
    <div className="score-cell">

      {/* bids */}
      <div className="bids-display">
        {tricksTaken}/{bidsMade}
      </div>

      {/* score */}
      <div className="score-display">
        {score}
      </div>

    </div>
  );
}
