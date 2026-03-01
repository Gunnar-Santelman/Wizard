export default class Card{
    trump=false;
    sprite=null;
    constructor(suit,val){
        this.suit=suit;
        this.value=val;
        this.isValid = false;
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
   toString(){
    return `${this.value} of ${this.suit}${this.trump?"(trump)":""}`
   }
}