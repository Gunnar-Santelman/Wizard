export default class Trick{

    constructor(trump)
    {
        this.ledCard = null;
        this.leader = null;
        this.currTrump=trump;
        this.cards=[];
    }
    setTrump(suit){
        this.currTrump=suit;
    }
    setLeader(player){
        this.leader=player;
    }
    setLed(card){
        this.ledCard=card;
    }
    addCard(card,player){
        this.cards.push({card,player});
    }

}