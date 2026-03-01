export default class Player {
    constructor(playerId, name) {
        this.name = name;
        this.socketId = playerId;
        this.hand = [];
        this.bid = -1;
        this.score = 0;
    }

    setBid(bid) {
        this.bid = bid;
    }

    setHand(hand) {
        this.hand = hand;
    }

    playCard(playedCard) {
        for (let i= 0; i < this.hand.length; i++) {
            const card = this.hand[0];
            if (card.value === playedCard.value && card.suit === playedCard.suit) {
                this.hand.pop(i);
            }
        }
    }
}