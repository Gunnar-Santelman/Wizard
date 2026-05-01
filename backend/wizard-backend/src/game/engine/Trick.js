// models the tricks in the game
export default class Trick{

    // creates a new trick with some set trump determined at the start
    constructor(trump)
    {
        this.ledCard = null;
        this.leader = null;
        this.currTrump=trump;
        this.cards=[];
    }
    // sets the trump suit for the trick
    setTrump(suit){
        this.currTrump=suit;
    }
    // sets which player will lead the trick
    setLeader(player){
        this.leader=player;
    }
    // sets which card led the trick to help determine lead suit
    setLed(card){
        this.ledCard=card;
    }
    // adds a card to the trick, linked with the player who placed it
    addCard(card,player){
        this.cards.push({card,player});
    }

}