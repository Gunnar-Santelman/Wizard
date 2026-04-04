import Deck from "./Deck";
import Card from "./Card";
import Suit from "./Suit";
import Round from "./Round";
import Rules from "./Rules";
import Scoring from "./Scoring";
import Trick from "./Trick";
import Player from "./Player";
import { describe, test, expect, beforeEach } from "@jest/globals";
import WizardGame from "../WizardGame";

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
 function makeMockGame(playerCount = 4) {
    const players = [];
    for (let i = 0; i < playerCount; i++) {
        const p = new Player(`socket-${i}`, `Player${i}`);
        p.incrementTricksTaken = () => { p.tricksTaken = (p.tricksTaken || 0) + 1; };
        p.resetRoundForPlayer = () => { p.hand = []; p.bid = -1; };
        players.push(p);
    }
    return { players, currentRound: null };
}

function playFullTrick(round, game) {
    for (let i = 0; i < game.players.length; i++) {
        const player = round.currentPlayer;
        player.hand[0].isValid = true;
        round.playCard(player.socketId, 0);
    }
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
    test("Increment trick count does that",()=>{
        player.incrementTricksTaken();
        expect(player.tricksTaken).toBe(1);
    })

});
describe("Round", () => {
    test("dealer rotates by round number", () => {
        const game = makeMockGame(4);
        const r1 = new Round(1, game);
        const r2 = new Round(2, game);
        const r3 = new Round(3, game);
        expect(r1.dealer).toBe(game.players[0]);
        expect(r2.dealer).toBe(game.players[1]);
        expect(r3.dealer).toBe(game.players[2]);
    });

    test("first player is left of dealer", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        expect(round.currentPlayer).toBe(game.players[1]);
    });

    test("dealer wraps around with more rounds than players", () => {
        const game = makeMockGame(4);
        const round = new Round(5, game); // round 5 % 4 = index 0 again
        expect(round.dealer).toBe(game.players[0]);
    });

    test("deals correct number of cards per player", () => {
        const game = makeMockGame(4);
        const round = new Round(3, game);
        for (const player of game.players) {
            expect(player.hand).toHaveLength(3);
        }
    });

    test("no cut card on last round", () => {
        const game = makeMockGame(4); // 60/4 = 15 rounds
        const round = new Round(15, game);
        expect(round.cutCard).toBeNull();
    });

    test("cut card exists on normal round", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        expect(round.cutCard).toBeInstanceOf(Card);
    });

    test("reorderPlayers starts from current player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game); // currentPlayer is players[1]
        // drain hands so playCard doesn't interfere
        const ordered = game.players.slice(1).concat(game.players.slice(0, 1));
        expect(round.currentPlayer).toBe(ordered[0]);
    });

    test("playCard rejects wrong player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const wrongPlayer = game.players[0]; // currentPlayer is players[1]
        const card = wrongPlayer.hand[0];
        round.playCard(wrongPlayer.socketId, 0);
        expect(round.currentTrick).toBeNull(); // trick never started
    });

    test("playCard advances to next player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const first = round.currentPlayer;
        const cardIndex = 0;
        first.hand[0].isValid = true;
        round.playCard(first.socketId, cardIndex);
        expect(round.currentPlayer).not.toBe(first);
    });

    test("trick increments after all players play", () => {
        const game = makeMockGame(4);
        const round = new Round(4, game);
        // mark all cards valid and play one per player in order
        for (let i = 0; i < game.players.length; i++) {
            const player = round.currentPlayer;
            player.hand[0].isValid = true;
            round.playCard(player.socketId, 0);
        }
        expect(round.trickNumber).toBe(1);
    });
});
describe("Round.placeBid", () => {
    test("stores bid on current player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const first = round.currentPlayer;
        round.placeBid(first.socketId, 2);
        expect(first.bid).toBe(2);
    });

    test("advances to next player after bid", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const first = round.currentPlayer;
        round.placeBid(first.socketId, 2);
        expect(round.currentPlayer).not.toBe(first);
    });

    test("rejects bid from wrong player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const wrongPlayer = game.players[0]; // currentPlayer is players[1]
        round.placeBid(wrongPlayer.socketId, 2);
        expect(wrongPlayer.bid).toBe(-1);
    });

    test("rejects bid from unknown socketId", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const before = round.currentPlayer;
        round.placeBid("not-a-real-id", 2);
        expect(round.currentPlayer).toBe(before);
    });
});

describe("Round.determineValidCards", () => {
    test("marks valid cards as isValid true", () => {
        const game = makeMockGame(4);
        const round = new Round(3, game);
        round.determineValidCards();
        for (const player of game.players) {
            expect(player.hand.some(c => c.isValid)).toBe(true);
        }
    });
});

describe("Round.moveToNextPlayer", () => {
    test("advances current player", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        const before = round.currentPlayer;
        round.moveToNextPlayer();
        expect(round.currentPlayer).not.toBe(before);
    });

    test("wraps around to first player after last", () => {
        const game = makeMockGame(4);
        const round = new Round(1, game);
        for (let i = 0; i < game.players.length; i++) {
            round.moveToNextPlayer();
        }
        expect(round.currentPlayer).toBe(game.players[1]); // back to start
    });
});

describe("Round.finishTrick", () => {
    test("increments trickNumber", () => {
        const game = makeMockGame(4);
        const round = new Round(4, game);
        playFullTrick(round, game);
        expect(round.trickNumber).toBe(1);
    });

    test("sets winner on round", () => {
        const game = makeMockGame(4);
        const round = new Round(4, game);
        playFullTrick(round, game);
        expect(round.winner).not.toBeNull();
    });

    test("clears currentTrick after finish", () => {
        const game = makeMockGame(4);
        const round = new Round(4, game);
        playFullTrick(round, game);
        expect(round.currentTrick).toBeNull();
    });
});

describe("Round.finishRound", () => {
    test("starts a new round on game when round is complete", () => {
        const game = makeMockGame(4); // last round is 15
        const round = new Round(1, game);
        game.currentRound = round;
        // play all tricks to trigger finishRound
        for (let t = 0; t < 1; t++) {
            playFullTrick(round, game);
        }
        expect(game.currentRound).not.toBe(round);
    });

 
});
describe("Scoring", () => {
    let scoring;
    let game;

    beforeEach(() => {
        game = makeMockGame(4);
        scoring = new Scoring(game);
    });

    test("initScoreboard creates entry for each player", () => {
        for (const player of game.players) {
            expect(scoring.scores[player.socketId]).toBeDefined();
        }
    });

    test("initScoreboard starts total at 0", () => {
        for (const player of game.players) {
            expect(scoring.scores[player.socketId].total).toBe(0);
        }
    });

    test("correct bid scores 20 plus 10 per trick", () => {
        const player = game.players[0];
        scoring.updateScore(player, 3, 3);
        expect(scoring.scores[player.socketId].total).toBe(50); // 20 + 30
    });

    test("correct bid of 0 scores 20", () => {
        const player = game.players[0];
        scoring.updateScore(player, 0, 0);
        expect(scoring.scores[player.socketId].total).toBe(20);
    });

    test("wrong bid loses 10 per trick off", () => {
        const player = game.players[0];
        scoring.updateScore(player, 3, 1); // 2 off
        expect(scoring.scores[player.socketId].total).toBe(-20);
    });

    test("wrong bid is negative regardless of direction", () => {
        const player = game.players[0];
        scoring.updateScore(player, 1, 3); // over by 2
        expect(scoring.scores[player.socketId].total).toBe(-20);
    });

    test("scores accumulate across rounds", () => {
        const player = game.players[0];
        scoring.updateScore(player, 2, 2); // 40
        scoring.updateScore(player, 3, 3); // 50
        expect(scoring.scores[player.socketId].total).toBe(90);
    });

    test("records bid history", () => {
        const player = game.players[0];
        scoring.updateScore(player, 2, 2);
        scoring.updateScore(player, 3, 1);
        expect(scoring.scores[player.socketId].bids).toEqual([2, 3]);
    });

    test("records tricks history", () => {
        const player = game.players[0];
        scoring.updateScore(player, 2, 2);
        scoring.updateScore(player, 3, 1);
        expect(scoring.scores[player.socketId].tricks).toEqual([2, 1]);
    });

    test("records round score history", () => {
        const player = game.players[0];
        scoring.updateScore(player, 2, 2); // 40
        scoring.updateScore(player, 0, 1); // -10
        expect(scoring.scores[player.socketId].rounds).toEqual([40, -10]);
    });

    test("scores are independent per player", () => {
        const p1 = game.players[0];
        const p2 = game.players[1];
        scoring.updateScore(p1, 3, 3); // 50
        scoring.updateScore(p2, 0, 2); // -20
        expect(scoring.scores[p1.socketId].total).toBe(50);
        expect(scoring.scores[p2.socketId].total).toBe(-20);
    });
});
describe("WizardGame", () => {
    let game;
    beforeEach(() => {
        game = new WizardGame("test-id");
    });

    test("initializes with empty players and waiting status", () => {
        expect(game.players).toHaveLength(0);
        expect(game.status).toBe("waiting");
    });

    test("first player to join becomes host", () => {
        game.joinGame("Alice", "socket-1");
        expect(game.host).toBe("socket-1");
    });

    test("subsequent players do not become host", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Bob", "socket-2");
        expect(game.host).toBe("socket-1");
    });

    test("joinGame adds player", () => {
        game.joinGame("Alice", "socket-1");
        expect(game.players).toHaveLength(1);
    });

    test("joinGame ignores duplicate socketId", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Alice", "socket-1");
        expect(game.players).toHaveLength(1);
    });

    test("removePlayer removes the player", () => {
        game.joinGame("Alice", "socket-1");
        game.removePlayer("socket-1");
        expect(game.players).toHaveLength(0);
    });

    test("host transfers when host leaves while waiting", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Bob", "socket-2");
        game.removePlayer("socket-1");
        expect(game.host).toBe("socket-2");
    });

    test("host does not transfer when game is running", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Bob", "socket-2");
        game.joinGame("C", "socket-3");
        game.startGame();
        game.removePlayer("socket-1");
        expect(game.host).toBe("socket-1"); // unchanged
    });

    test("isEmpty returns true when no players", () => {
        expect(game.isEmpty()).toBe(true);
    });

    test("isEmpty returns false when players exist", () => {
        game.joinGame("Alice", "socket-1");
        expect(game.isEmpty()).toBe(false);
    });

    test("startGame sets status to running", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Bob", "socket-2");
        game.joinGame("C", "socket-3");
        game.startGame();
        expect(game.status).toBe("running");
    });

    test("startGame sets maxRounds based on player count", () => {
        game.joinGame("Alice", "socket-1");
        game.joinGame("Bob", "socket-2");
        game.joinGame("C", "socket-3");
        game.joinGame("D", "socket-4");
        game.startGame();
        expect(game.maxRounds).toBe(15); // 60/4
    });

    test("getGameState returns correct shape", () => {
        game.joinGame("Alice", "socket-1");
        const state = game.getGameState();
        expect(state).toMatchObject({
            id: "test-id",
            status: "waiting",
            host: "socket-1"
        });
    });
});

