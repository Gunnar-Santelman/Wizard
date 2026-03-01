export default class Card{
    #suit;
    #value;
    #trump=false;
    #sprite=null;
    constructor(suit,val){
        this.#suit=suit;
        this.#value=val;
    }
   get suit(){return this.#suit};
   get value(){return this.#value};
   get trump(){return this.#trump};
   get sprite(){return this.#sprite};
   /**
    * Boolean setter for trump.
    * @param {*} state The desired state.
    */
   setTrump(state){
    this.#trump=Boolean(state);
   }
   toString(){
    return `${this.value} of ${this.suit}${this.trump?"(trump)":""}`
   }
}