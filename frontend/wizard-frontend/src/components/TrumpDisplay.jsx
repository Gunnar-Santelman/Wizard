import { useState } from "react";
import Card from ':/Card.jsx';


export default function TrumpDisplay({
  trumpSuit="spades",
  trumpValue=14
}) {

   return (
    <div
      className="trump-display"
      style={{
        width: "300px",
        minHeight: "50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: '#6CB274',
        color: "white",
        gap: "10px",
        padding: "10px",
        borderRadius: "50px",
      }}
    >

      {/* Text */}
      <span
        style={{
          fontSize: "18px",
          textAlign: "center",
          marginLeft: "auto",
        }}
      >
        Trump
      </span>

      {/* Trump */}

      <Card
        suit={trumpSuit}
        value={trumpValue}
      />


      </div>)

}