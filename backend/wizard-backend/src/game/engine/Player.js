// models a player of the game
export default class Player {
    // sets necessary variables for tracking player performance
    constructor(playerId, uid, name, profilePicture) {
        this.name = name;
        this.profilePicture = profilePicture;
        this.socketId = playerId;
        this.uid = uid;
        this.hand = [];
        this.bid = -1;
        this.tricksTaken = 0;
        this.roundScores = {}
        this.score = 0;
        this.playedCard = null;
    }

    // sets the user bid
    setBid(bid) {
        this.bid = bid;
    }
    // sets the hand of the player
    setHand(hand) {
        this.hand = hand;
    }
    // increases the number of tricks taken by one
    incrementTricksTaken() {
        this.tricksTaken++;
    }

    // reset the necessary variables for starting a new round
    resetRoundForPlayer() {
        this.bid = -1;
        this.tricksTaken = 0;
    }
    // retrieves a card from a player's hand based on its index
    getCardByIndex(index) {
        return this.hand[index];
    }

    // removes the card from a player's hand corresponding to the played card identity
    playCard(playedCard) {
        for (let i= 0; i < this.hand.length; i++) {
            const card = this.hand[i];
            if (playedCard.value === card.value && playedCard.suit === card.suit && playedCard.identifier === card.identifier) {
                this.hand.splice(i, 1);
                this.playedCard = playedCard;
                return;
            }
        }
    }

    // calculates round score at the end of a round based on Wizard's scoring rules
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