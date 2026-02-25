

class Deck{
    #cards;
    constructor(){
        this.#cards=[];
        this.populateDeck();
        this.shuffleDeck();
    }
    /**
     * Populates an empty deck with a standard wizard deck.
     */
    populateDeck(){
        for(const suit of Object.values(SUIT)){
            for(let i=1;i<15;i++)
            {
                // push all your numbered and face cards
                this.#cards.push(new Card(suit,i));
            }
            // push a wizard and a jester for every suit as well
            this.#cards.push(new Card(null,0));
            this.#cards.push(new Card(null,15));
        }
        
    }
    /**
     * Shuffles the populated deck using Fisher-Yates algorithm O(n) complexity
     */
    shuffleDeck(){ 
       for (let i=this.#cards.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [this.#cards[i],this.#cards[j]]=[this.#cards[j],this.#cards[i]]
       }
       
    }
    /**
     * Cuts the top card off the deck, returns it.
     */
    cutCard(){
        // yes its the last element but does it matter?
        return this.#cards.pop()
    }
}