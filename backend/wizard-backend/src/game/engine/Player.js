export default class Player {
    constructor(playerId, name, profilePicture) {
        this.name = name;
        this.profilePicture = profilePicture;
        this.socketId = playerId;
        this.hand = [];
        this.bid = -1;
        this.tricksTaken = 0;
        this.roundScores = {}
        this.score = 0;
        this.playedCard = null;
    }

    setBid(bid) {
        this.bid = bid;
    }

    setHand(hand) {
        this.hand = hand;
    }

    incrementTricksTaken() {
        this.tricksTaken++;
    }

    resetRoundForPlayer() {
        this.bid = -1;
        this.tricksTaken = 0;
    }

    playCard(playedCard) {
        for (let i= 0; i < this.hand.length; i++) {
            const card = this.hand[i];
            if (playedCard.value === card.value && playedCard.suit === card.suit) {
                this.hand.splice(i, 1);
                this.playedCard = playedCard;
            }
        }
    }

    updateScore(roundNumber) {
        let currScore = 0
        if(this.bid!=this.tricksTaken)
        {
            // 10 per trick wrong
            currScore=10*(-Math.abs(this.bid-this.tricksTaken));
            
        }
        else{
            // 20 for being correct plus 10 per trick taken
            currScore=20+(10*this.tricksTaken);
            
        }
        this.roundScores[roundNumber] = currScore
        this.score += currScore
    }
}