import { useState } from "react";
import socket from "../socket";

export default function BidSelection({ maxBid = 5, gameId }) {
  const [bidAmount, setBidAmount] = useState(0);
  const minBid = 0;

  const increaseBid = () => {
    if (bidAmount < maxBid) {
      setBidAmount(bidAmount + 1);
    }
  };

  const decreaseBid = () => {
    if (bidAmount > minBid) {
      setBidAmount(bidAmount - 1);
    }
  };

  const placeBid = () => {
    // Put stuff here!
    console.log(`Bid placed: ${bidAmount}`);
    socket.emit("placeBid", {
      gameId,
      bidAmount
    });
  };

  return (
    <div>
      <div style = {{position: "absolute",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "15px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        borderRadius: "15px",
        zIndex: "100"}}>
        <h1>Place Your Bid</h1>

        <div>
          {/* Up arrow button */}
          <button
            onClick={increaseBid}
            disabled={bidAmount >= maxBid}
            className="w-16 h-16 border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="w-16 h-16 text-gray-700">▲</span>
          </button>

          {/* Current bid amount */}
          <div>{bidAmount}</div>

          {/* Down arrow button */}
          <button
            onClick={decreaseBid}
            disabled={bidAmount <= minBid}
            className="w-16 h-16 border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="w-16 h-16 text-gray-700">▼</span>
          </button>
        </div>

        <p>
          Bid between {minBid} and {maxBid}
        </p>

        {/* confirm button */}
        <button
          onClick={placeBid}
          className="hover:bg-gray-800 transition-colors"
        >
          Confirm Bid
        </button>
      </div>
    </div>
  );
}
