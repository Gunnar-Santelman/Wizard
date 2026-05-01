import SUIT from "./Suit.js";

// models a Card object for the game
export default class Card{
    trump=false;
    sprite=null;
    constructor(suit,val, identifier = null){
        this.suit=suit;
        this.value=val;
        this.isValid = false;
        this.identifier = identifier; // used to differentiate between different jokers and wizards(otherwise would have same suit/value combo)
        this.id = crypto.randomUUID(); // used for animations in frontend and for ensuring proper card is played
    }
    
   // sets whether or not the card is part of the trump suit
   setTrump(state){
    this.trump=Boolean(state);
   }
   // sets whether the card is valid to be played currently
   setValid(valid) {
    this.isValid = valid;
   }
   // orders the card by suit(clubs, diamonds, spades, hearts), with jesters on the left and wizards on the right
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