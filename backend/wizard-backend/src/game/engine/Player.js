class Player {
    constructor(playerId) {
        this.id = playerId;
        this.hand = [];
        this.bid = -1;
    }

    setBid(bid) {
        this.bid = bid;
    }
    getBid() {
        return this.bid;
    }

    setHand(hand) {
        this.hand = hand;
    }
    getHand(hand) {
        return hand;
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