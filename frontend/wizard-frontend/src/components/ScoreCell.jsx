import { useState } from "react";

export default function ScoreCell({
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
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >

      {/* score */}
      <div
        style={{
          fontSize: "28px",
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
