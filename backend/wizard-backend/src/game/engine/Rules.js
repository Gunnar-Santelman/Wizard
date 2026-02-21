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
    determineTrickWinner(Trick)
    {
        let cards=Trick.cards;
        let values=cards.map(card=>card.value);
        let lead=Trick.leadSuit;
        if(values.includes(15)){
            return cards.find(card=>card.value==15);
            // first wizard wins if its a wizard
        }
        else{
            // this loops through the array, comparing each to a best value, and updates it if the comparator is positive
            winner=cards.reduce((best,card)=>{
                return this.compareCard(card,best,lead)>0
                ?card 
                :best;

            })
            return winner;
        }
        
    }   
    compareCard(a,b,leadSuit){
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
}