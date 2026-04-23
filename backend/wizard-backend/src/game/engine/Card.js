import SUIT from "./Suit.js";
export default class Card{
    trump=false;
    sprite=null;
    constructor(suit,val){
        this.suit=suit;
        this.value=val;
        this.isValid = false;
        this.id = crypto.randomUUID();
    }
    
   /**
    * Boolean setter for trump.
    * @param {*} state The desired state.
    */
   setTrump(state){
    this.trump=Boolean(state);
   }
   setValid(valid) {
    this.isValid = valid;
   }
   static orderCards(firstCard, secondCard) {
    if (firstCard.value === 15) {
        return 1;
    } else if (secondCard.value === 15) {
        return -1;
    }

    if (firstCard.suit === SUIT.CLUBS && secondCard.suit === SUIT.CLUBS) {
        if (firstCard.value > secondCard.value) {
            return 1;
        }
        else {
            return -1;
        }
    } else if (firstCard.suit === SUIT.CLUBS && secondCard.suit !== SUIT.CLUBS) {
        return 1;
    } else if (firstCard.suit !== SUIT.CLUBS && secondCard.suit === SUIT.CLUBS) {
        return -1;
    }

    if (firstCard.suit === SUIT.DIAMONDS && secondCard.suit === SUIT.DIAMONDS) {
        if (firstCard.value > secondCard.value) {
            return 1;
        }
        else {
            return -1;
        }
    } else if (firstCard.suit === SUIT.DIAMONDS && secondCard.suit !== SUIT.DIAMONDS) {
        return 1;
    } else if (firstCard.suit !== SUIT.DIAMONDS && secondCard.suit === SUIT.DIAMONDS) {
        return -1;
    }

    if (firstCard.suit === SUIT.SPADES && secondCard.suit === SUIT.SPADES) {
        if (firstCard.value > secondCard.value) {
            return 1;
        }
        else {
            return -1;
        }
    } else if (firstCard.suit === SUIT.SPADES && secondCard.suit !== SUIT.SPADES) {
        return 1;
    } else if (firstCard.suit !== SUIT.SPADES && secondCard.suit === SUIT.SPADES) {
        return -1;
    }

    if (firstCard.suit === SUIT.HEARTS && secondCard.suit === SUIT.HEARTS) {
        if (firstCard.value > secondCard.value) {
            return 1;
        }
        else {
            return -1;
        }
    } else if (firstCard.suit === SUIT.HEARTS && secondCard.suit !== SUIT.HEARTS) {
        return 1;
    } else if (firstCard.suit !== SUIT.HEARTS && secondCard.suit === SUIT.HEARTS) {
        return -1;
    }
   }
   toString(){
    return `${this.value} of ${this.suit}${this.trump?"(trump)":""}`
   }
}