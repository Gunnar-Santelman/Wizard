import { useState } from 'react';
import socket from "../socket";
/*

Possible Card States:
1) DEFAULT   Default (valid and not hovered)

2) VALID     Highlighted (valid and hovered, pops out of hand)
    onMouseEnter and onMouseLeave tell you when it's being hovered

3) INVALID   Grayscale (invalid)

4) BACK      Back (other players' hands)

*/

export default function Card({ suit="spades", value=14, inPlayersHand=true, isPlayed = false, isValidPlay = false, isBidPhase=false, index, rotation, gameId, isMyTurn }) {
    const [isHovered, setIsHovered] = useState(false)
    const handleClick = () => {
        if (!isValidPlay || !inPlayersHand || isBidPhase) {
            return;
        }
        socket.emit("playCard", {
            gameId,
            index
        });
    };

    return (
        <img
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}

            // Shows either front or back of card, if it's in the player's hand or not
            src={inPlayersHand || isPlayed ? `/cards/${value}_of_${suit}.png` : "https://clipart-library.com/images/8cxrbGE6i.jpg"}

            alt={value + " of " + suit}
            className="card"
            style={{
                width: '120px',
                height: '168px',
                border: inPlayersHand && isHovered && isValidPlay && !isBidPhase && isMyTurn ? "thick ridge gold" : "thick ridge transparent",
                borderRadius: '5px',
                transform: `
                    rotate(${rotation}deg)
                    ${isHovered && inPlayersHand ? "translateY(-30px)": ""}
                    ${inPlayersHand && isHovered && isValidPlay && !isBidPhase && isMyTurn ? "scale(1.1)" : "scale(1)"}
                `,
                filter: inPlayersHand && isHovered && (!isValidPlay || isBidPhase || !isMyTurn) ? "contrast(50%)" : "none",
                transition: "transform 0.3s ease, border 0.3s ease, filter 0.3s ease",
                cursor:inPlayersHand && isHovered && isValidPlay && !isBidPhase ? 'pointer' : 'not-allowed'
             }}
           
        />
    );
}

