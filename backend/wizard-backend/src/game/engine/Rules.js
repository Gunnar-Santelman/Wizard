class Rules{
    
    determineTrump(card){
       let TRUMP;
        if(card.value==15 ){ //wizard case
           // present a choice to the player who dealt
        } else if(card.value==0)
        {
            // if jester, no trump
            TRUMP=null;
        }
        else{
            // otherwise, the trump is the suit of the cut card
            TRUMP=card.suit;
        }
        return TRUMP;
    }
    /**
     * Determines the winner of a trick.
     * @param {Trick} Trick The trick being played.
     * @returns a pair object that goes {card,player} that won the trick
     */
    static determineTrickWinner(Trick)
    {
        let cards=Trick.cards;
        
        let lead=Trick.leadSuit;
        const firstWizard= cards.find(({card})=>card.value==15);
        if(firstWizard) return firstWizard.player;
        
            // this loops through the array, comparing each to a best value, and updates it if the comparator is positive
           const winner=cards.reduce((best,curr)=>{
                return this.compareCard(curr.card,best.card,lead)>0
                ?curr 
                :best;

            })
            return winner;
        
        
    }   
    static compareCard(a,b,leadSuit){
    //wizards
    if (a.value==15&&b.value!==15) return 1;
    if (b.value === 15 && a.value !== 15) return -1;
    //jesters
    if (a.value==0&&b.value!==0) return -1;
    if (b.value==0&&a.value!==0) return 1;

    //Trump suit
    
    if (a.trump&&!b.trump) return 1;
    if (b.trump&&!a.trump) return -1;
    //lead 
    const aLead=a.suit==leadSuit;
    const bLead=b.suit==leadSuit;
    if(aLead&&!bLead ) return 1;
    if(bLead&&!aLead) return -1;
    // if all fall through, return numeric difference
    return a.value-b.value;
    }
    static isValidPlay(card,hand,leadSuit){
        // you can always play a special card
        if(card.value==0||card.value==15) return true;
        
        if(!leadSuit) return true; //for the first card played
        const canFollow=hand.some(c=>c.suit==leadSuit); // if some card in your hand can follow suit
        if(canFollow){
            return card.suit==leadSuit; // it will return true if you follow suit then, false if you can but dont
        }
        return true; // if you can't its always valid
    }
}