class Trick{
    #cards;
    #ledCard;
    #currTrump;
    #leader;
    get ledCard(){return this.#ledCard};
    get leader(){return this.#leader};
    get currTrump(){return this.#currTrump};
    get cards(){return this.#cards};
    constructor(trump)
    {
        this.#currTrump=trump;
        this.cards=[];
    }
    setTrump(suit){
        this.#currTrump=suit;
    }
    setLeader(player){
        this.#leader=player;
    }
    setLed(card){
        this.ledCard=card;
    }
    addCard(card,player){
        this.#cards.push({card,player});
    }

}