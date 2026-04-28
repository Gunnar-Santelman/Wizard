import { useState } from "react";
import socket from "../socket";
import "../styling/BidSelection.css";

// Creates a popup menu that allows the user to click up and down to view and select their bid for the upcoming round
export default function BidSelection({ maxBid = 5, gameId }) {
  const [bidAmount, setBidAmount] = useState(0);
  const minBid = 0;

  // increases the bid by 1
  const increaseBid = () => {
    if (bidAmount < maxBid) {
      setBidAmount(bidAmount + 1);
    }
  };

  // decreases the current bid by 1
  const decreaseBid = () => {
    if (bidAmount > minBid) {
      setBidAmount(bidAmount - 1);
    }
  };

  // sets the bid in the backend via WebSockets
  const placeBid = () => {
    console.log(`Bid placed: ${bidAmount}`);
    socket.emit("placeBid", {
      gameId,
      bidAmount
    });
  };

  return (
    <div className= "bid-overlay">
      <div className = "bid-popup">
        <h1>Place Your Bid</h1>

        <div>
          {/* Up arrow button */}
          <button
            onClick={increaseBid}
            disabled={bidAmount >= maxBid}
            className= "alter-btn"
          >
            <span className="symbol">▲</span>
          </button>

          {/* Current bid amount */}
          <div className="bid-value">{bidAmount}</div>

          {/* Down arrow button */}
          <button
            onClick={decreaseBid}
            disabled={bidAmount <= minBid}
            className= "alter-btn"
          >
            <span className="symbol">▼</span>
          </button>
        </div>

        <p>
          Bid between {minBid} and {maxBid}
        </p>

        {/* confirm button */}
        <button
          onClick={placeBid}
          className="submit-btn"
        >
          Confirm Bid
        </button>
      </div>
    </div>
  );
}
