import WizardGame from "../WizardGame.js";
import Deck from "./Deck.js";

export default class Round{
    #dealer;
    #roundNo;
    #currentPlayer;
    #trickNo;
    #cutCard;
    #game;
    #deck;
    #trickCards;
    constructor(roundNo,game){
        
        this.#roundNo=roundNo;
        this.#game=game;
        // rotates dealer and sets player to the left of the dealer 
        const dealerInd=(this.#roundNo-1)%this.#game.players.length;
        this.#dealer=this.#game.players[dealerInd];
        this.#currentPlayer=game.players[(dealerInd+1)%this.#game.players.length];
        this.#trickNo=0;
        this.#trickCards=[];
        this.#deck=new Deck();
        this.#cutCard=this.#deck.cutCard();
        this.dealCards();

    }
    get dealer(){return this.#dealer};
    get roundNo(){return this.#roundNo};
    get currentPlayer(){return this.#currentPlayer};
    get trickNo(){return this.#trickNo};
    get cutCard(){return this.#cutCard};
    /**
     * for the front end, returns an object of the encapsulated state of a round
     * @returns  an object with fields for each of the class variables of the round.
     */
    getRoundState(){
        return new Object(this.#dealer,this.#currentPlayer,this.#roundNo,this.#cutCard,this.#deck,this.#trickCards);
    }
    /**
     * Sets the current dealer.
     * @param {Player} player the player object of the player.
     */
    setDealer(player){
        this.#dealer=player;
    }
    /**
     * Sets the current player.
     * @param {Player} player player object of the desired player.
     */
    setCurrentPlayer(player){
        this.#currentPlayer=player;
    }
    /**
     * Increments the trick number by 1.
     */
    incTrickNo(){
        this.#trickNo++;
    }
    /**
     * Deals n cards to the player depending on the round number.
     */
    dealCards(){
        for(const player of this.#reorderPlayers(this.#currentPlayer)){
            for(let i=1;i<this.#roundNo+1;i++)
            {
                // im going to deal the cards 4 at a time to the players
                //  because I don't believe in the "this is my card" superstition
                player.hand.push(this.#deck.cutCard());
            }
        }
    }
    /**
     * collects bids for the round
     */
    collectBids(){
        for (const player of this.#reorderPlayers(this.#currentPlayer))
        {
            // offer player bid choice 0-round number
            // player.setbid(choice)
        }
    }
    /**
     * Helper function to reorder play within a round.
     * @param {Player} start 
     * @returns a player array ordered through the leading player.
     */
    #reorderPlayers(start){
        const players=this.#game.players;
        const starting=players.indexOf(start);
        // this splits the array at the index, then appends the rest before it so it wraps around
        return [...players.slice(starting),...players.slice(0,starting)]
    }
    determineValidCards() {
        return;
    }
    playRound(){
        let trump=Rules.determineTrump(this.cutCard);
        this.collectBids();
        for(let tricks=0;tricks<this.roundNo;tricks++)
        {
             
            const trick=new Trick(trump);
            this.#trickCards=[]
            let count=0;
            for( const player of this.#reorderPlayers(this.#currentPlayer))
            {
               //TODO:  offer the player a choice to play as a pair object {card,player}

               if(count===0){
                trick.setLed(null);
               }
               while(!Rules.isValidMove(null)){
                // change the choice var
                
               }
               // then it will fall through and place the card in the trick
               trick.addCard(null, player.id);
               this.#trickCards.push(null)
               count++;

            }
            let winner=Rules.determineTrickWinner(trick).player;
            // last player leads off 
            this.setCurrentPlayer(winner);
            // increment player stat 
            // score the round based on everyones bids
            // pop the scoreboard up
        }
    }

}