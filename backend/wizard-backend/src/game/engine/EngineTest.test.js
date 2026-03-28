import Deck from "./Deck";
import Card from "./Card";
import Suit from "./Suit";
import Round from "./Round";
import Rules from "./Rules";
import Scoring from "./Scoring";
import Trick from "./Trick";
import Player from "./Player";
import { describe, test, expect, beforeEach } from "@jest/globals";

    function makeCard(suit,value,trump=false){
        const c=new Card(suit,value);
        if(trump)c.setTrump(true);
        return c;
    }
    function makeWizard() {
        return makeCard(null,15);
    }
    function makeJester()
    {
        return makeCard(null,1);
    }
    function makeTrick(pairs,leadCard=null){
        const t=new Trick(null);
        if(leadCard)t.setLed(leadCard);
        for(const{card,player} of pairs)t.addCard(card,player);
        return t;
    }

    describe("Card",()=>{
        test("Orders Cards correctly",()=>{
        const c1=makeCard(Suit.HEARTS,7);
        const c2=makeCard(Suit.HEARTS,8);
        expect(c1.suit).toBe(Suit.HEARTS);
        expect(c2.value).toBe(8);
        expect(Card.orderCards(c1,c2)).toBe(-1);
    });
       test("trump defaults to false", () => {
        expect(makeCard(Suit.SPADES, 5).trump).toBe(false);
    });
 
    test("setTrump sets trump to true", () => {
        const c = makeCard(Suit.CLUBS, 3);
        c.setTrump(true);
        expect(c.trump).toBe(true);
    });
 
    test("toString includes trump label when trump", () => {
        const c = makeCard(Suit.HEARTS, 10, true);
        expect(c.toString()).toContain("(trump)");
    });
 
    test("toString doesnt include trump label when not trump", () => {
        const c = makeCard(Suit.HEARTS, 10);
        expect(c.toString()).not.toContain("(trump)");
    });
 
    test("isValid defaults to false", () => {
        expect(makeCard(Suit.HEARTS, 5).isValid).toBe(false);
    });
    });

    describe("Deck",()=>{
        let deck;
        beforeEach(()=>{deck=new Deck();});
        test("has 60 cards",()=>{
            // dang security, I made deck size private
            let count=0;
            while(deck.cutCard()!==null)count++;
            expect(count).toBe(60)
            
        });
        test("cutCard pops a card off",()=>{
            const card=deck.cutCard();
            expect(card).toBeInstanceOf(Card);
    });
    test("cutCard returns null on empty deck",()=>{
        while(deck.cutCard()!==null){}
        expect(deck.cutCard()).toBeNull();
    });
    test("Shuffle produces random order across two instances (if this fails screenshot and I will give you 5$)",()=>{
        const deck2=new Deck();
        const order1=[],order2=[];
        let card;
        let card2;
        while((card=deck.cutCard())!==null)order1.push(card)
        while((card2=deck2.cutCard())!==null)order2.push(card2)
        expect(order1).not.toEqual(order2);
    });

    });
    describe("Trick",()=>{
        test("Defaults empty",()=>{
            expect(new Trick(null).cards).toHaveLength(0);
        });
        test("Add card stores card player pair",()=>{
            const t=new Trick(null);
            const c=makeCard(Suit.HEARTS,5);
            const pl=new Player("id","name")
            t.addCard(c,pl);
            expect(t.cards[0]).toEqual({card:c,player:pl});

        });
        test("setLed sets ledCard", () => {
            const t = new Trick(null);
            const card = makeCard(Suit.CLUBS, 9);
            t.setLed(card);
            expect(t.ledCard).toBe(card);
    });
 
        test("setTrump updates trump", () => {
            const t = new Trick(null);
            t.setTrump(Suit.SPADES);
            expect(t.currTrump).toBe(Suit.SPADES);
    });
    })
    describe("Rules",()=>{

        test("determine trump returns null for null cut",()=>{
            expect(Rules.determineTrump(null)).toBeNull();
        });
        test("determine trump returns suit of standard card",()=>{
            expect(Rules.determineTrump(makeCard(Suit.HEARTS,7))).toBe(Suit.HEARTS);

        });
        test("returns null for a jester cut card", () => {
        expect(Rules.determineTrump(makeJester())).toBeNull();
        });
 
        test("returns null for wizard (dealer chooses — placeholder)", () => {
        expect(Rules.determineTrump(makeWizard())).toBeNull();
        });
        test("compare- wizard beats all",()=>{
            expect(Rules.compareCard(makeWizard(),makeCard(Suit.HEARTS,14),Suit.HEARTS)).toBeGreaterThan(0);
        });
        test("Jester loses to all",()=>{
            expect(Rules.compareCard(makeJester(),makeCard(Suit.CLUBS,14),Suit.HEARTS)).toBeLessThan(0);
        });
        test("Trump beats lead",()=>{
            const trump=makeCard(Suit.SPADES,2,true);
            const lead=makeCard(Suit.HEARTS,14);
            expect(Rules.compareCard(trump,lead,Suit.HEARTS)).toBeGreaterThan(0);
        });
        test("lead beats off suit",()=>{
            const lead=makeCard(Suit.HEARTS,3);
            const off=makeCard(Suit.CLUBS,5);
            expect(Rules.compareCard(lead,off,Suit.HEARTS)).toBeGreaterThan(0);
        });
        test("same suit higher wins",()=>{
            const high = makeCard(Suit.HEARTS, 14);
            const low = makeCard(Suit.HEARTS, 7);
            expect(Rules.compareCard(high, low, Suit.HEARTS)).toBeGreaterThan(0);
        });
        test("det trick winner- First wizard wins",()=>{
            const lead=makeCard(Suit.HEARTS,14);
            const wiz=makeWizard;
            const high=makeCard(Suit.HEARTS,13)
            let p1=new Player(null,"p1");
            let p2=new Player(null,"p2");
            let p3=new Player(null,"p3");
            const trick=makeTrick([{card:lead,player:p1},{card:wiz,player:p2},{card:high,player:p3}],lead);
            expect(Rules.determineTrickWinner(trick).player).toBe(p2);
          
            
        });
        test("trump beats lead",()=>{
            const lead=makeCard(Suit.CLUBS,14);
            const trump=makeCard(Suit.HEARTS,13,true)
            let p1=new Player(null,"p1");
            let p2=new Player(null,"p2");
            const trick=makeTrick([{card:lead,player:p1},{card:trump,player:p2}],lead);
            expect(Rules.determineTrickWinner(trick).player).toBe(p2);
        });
        test("Highest lead wins if no trump or wizard",()=>{
            const lead=makeCard(Suit.HEARTS,7);
            const high=makeCard(Suit.HEARTS,14);
            const off=makeCard(Suit.CLUBS,14)
            let p1=new Player(null,"p1");
            let p2=new Player(null,"p2");
            let p3=new Player(null,"p3");
            const trick=makeTrick([{card:lead,player:p1},{card:high,player:p2},{card:off,player:p3}],lead);
            expect(Rules.determineTrickWinner(trick).player).toBe(p2);
          
        });
        test("jesty festy first one wins",()=>{
            const lead=makeJester;
            const high=makeJester
            const off=makeJester
            let p1=new Player(null,"p1");
            let p2=new Player(null,"p2");
            let p3=new Player(null,"p3");
            const trick=makeTrick([{card:lead,player:p1},{card:high,player:p2},{card:off,player:p3}]);
            expect(Rules.determineTrickWinner(trick).player).toBe(p1);
          
        });
        
    });
    describe("Rules.isValidPlay", () => {
    const hearts5  = makeCard(Suit.HEARTS, 5);
    const hearts9  = makeCard(Suit.HEARTS, 9);
    const clubs7   = makeCard(Suit.CLUBS, 7);
 
        test("wizard is always valid", () => {
            expect(Rules.isValidPlay(makeWizard(), [makeWizard(), hearts5], Suit.HEARTS)).toBe(true);
        });
 
        test("jester is always valid", () => {
            expect(Rules.isValidPlay(makeJester(), [makeJester(), hearts5], Suit.HEARTS)).toBe(true);
        });
 
        test("no lead suit set any card valid", () => {
            expect(Rules.isValidPlay(clubs7, [clubs7, hearts5], null)).toBe(true);
        });
 
        test("must follow suit when able", () => {
            expect(Rules.isValidPlay(clubs7, [clubs7, hearts5], Suit.HEARTS)).toBe(false);
        });
 
        test("following suit is valid", () => {
            expect(Rules.isValidPlay(hearts5, [clubs7, hearts5], Suit.HEARTS)).toBe(true);
        });
 
        test("off suit valid when cannot follow", () => {
            expect(Rules.isValidPlay(clubs7, [clubs7], Suit.HEARTS)).toBe(true);
        });
});
describe("Player",()=>{
    let player; 
    beforeEach(()=>{player=new Player("S1","Gus");});
    test("init with empty hand",()=>{
        expect(player.hand).toHaveLength(0);

    });
    test("SetBid stores bid",()=>{
        player.setBid(3);
        expect(player.bid).toBe(3);

    });
    test("Playcard pops card out of hand, sets playedCard",()=>{
        const c=makeCard(Suit.HEARTS,7);
        player.hand.push(c);
        player.playCard(c);
        expect(player.hand).toHaveLength(0);
        expect(player.playedCard).toBe(c);
    });
    test("playCard does nothing for not in hand",()=>{
        const card=makeCard(Suit.HEARTS,7);
        player.playCard(card);
        expect(player.playedCard).toBeNull();
    });

});

