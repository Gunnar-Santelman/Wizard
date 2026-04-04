import { useState } from "react";

export default function BidScoreCell({
  tricksTaken = 2,
  bidsMade = 4,
  score = -20
}) {

  return (
    <div
      className="score-cell"
      style={{
        width: "300px",
        minHeight: "50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >

      {/* bids */}
      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          textAlign: "center",
          marginLeft: "auto",
        }}
      >
        {tricksTaken}/{bidsMade}
      </div>

      {/* score */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          marginLeft: "auto",
        }}
      >
        {score}
      </div>

    </div>
  );
}
