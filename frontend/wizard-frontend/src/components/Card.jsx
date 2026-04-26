import { useState, useEffect } from "react";
import socket from "../socket";
import "../styling/Card.css";
/*
Possible Card States:
1) DEFAULT   Default (valid and not hovered)

2) VALID     Highlighted (valid and hovered, pops out of hand)
    onMouseEnter and onMouseLeave tell you when it's being hovered

3) INVALID   Grayscale (invalid)

4) BACK      Back (other players' hands)

*/
// displays the various elements of the card to the player; if its in their hand or on the table, they see card, else just the back
export default function Card({
  suit = "spades",
  value = 14,
  inPlayersHand = true,
  isPlayed = false,
  isValidPlay = false,
  isBidPhase = false,
  index,
  rotation,
  gameId,
  isMyTurn,
  hand = [],
  id = null,
  identifier = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [hand]);

  // sends the signal that a card has been played to the backend as long as it is the player's turn, their card, etc
  const handleClick = () => {
    if (!isValidPlay || !inPlayersHand || isBidPhase || isPlaying) {
      return;
    }
    setIsPlaying(true);
    socket.emit("playCard", {
      gameId,
      cardId: id,
    });
  };

  return (
    <img
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      // Shows either front or back of card, if it's in the player's hand or not
      src={
        inPlayersHand || isPlayed
          ? `/cards/${value}_of_${suit}.png`
          : "https://clipart-library.com/images/8cxrbGE6i.jpg"
      }
      alt={value + " of " + suit}
      className="card"
      style={{
        // creates gold border if it can be played
        border:
          inPlayersHand && isHovered && isValidPlay && !isBidPhase && isMyTurn
            ? "thick ridge gold"
            : "thick ridge transparent",
        // shifts the card up when the player hovers over it if the ccard is in the player's hand
        transform: `
                    rotate(${rotation}deg)
                    ${isHovered && inPlayersHand ? "translateY(-30px)" : ""}
                    ${inPlayersHand && isHovered && isValidPlay && !isBidPhase && isMyTurn ? "scale(1.1)" : "scale(1)"}
                `,
        // shows the card as invalid if the player can't play it from their hand
        filter:
          inPlayersHand &&
          isHovered &&
          (!isValidPlay || isBidPhase || !isMyTurn)
            ? "contrast(50%)"
            : "none",
        cursor:
          inPlayersHand && isHovered && isValidPlay && !isBidPhase
            ? "pointer"
            : "not-allowed",
      }}
    />
  );
}
