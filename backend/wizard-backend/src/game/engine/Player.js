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
}