import { useState } from "react";

export default function BidSelection({ maxBid = 5 }) {
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
    console.log("Bid placed: ${bidAmount}");
  };

  return (
    <div>
      <div>
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
