import Round from "./engine/Round.js";
import Player from "./engine/Player.js";

export class WizardGame {
    constructor (gameId) {
        this.id = gameId;
        this.host = null;
        this.players = [];
        this.maxRounds = 0;
        this.currentRound = null;
        this.deck = [];
        this.status = "waiting";
    }

    joinGame(playerName, socketId) {
        if (this.players.length === 0) {
            this.host = socketId;
        }

        const alreadyExists = this.players.find(
            p => p.socketId === socketId
        );

        if (alreadyExists) {
            return;
        }
        // const testCard1 = new Card("clubs", 14);
        // testCard1.setValid(true);
        // const testCard2 = new Card("spades", 2);
        // testCard2.setValid(false);
        this.players.push(
            new Player(socketId, playerName)
        );
    }
    
    removePlayer(socketId) {
        this.players = this.players.filter(
            p => p.socketId !== socketId
        );
        if (socketId === this.host && this.players.length !== 0 && this.status === "waiting") {
            this.host = this.players[0].socketId;
        }
    }

    startGame() {
        this.status = "running";
        this.maxRounds = 60 / this.players.length;
        // test trick
        this.currentRound = new Round(1, this);
        // this.playGame();
    }

    playGame() {
        for (let i = 0; i <= this.maxRounds; i++) {
            this.currentRound = new this.maxRounds(i, this);
            this.currentRound.playRound();
        }
    }

    isEmpty() {
        return this.players.length === 0;
    }
    
    getGameState() {
        return  {
            id: this.id,
            players : this.players,
            status : this.status,
            host: this.host
        };
    }
}

export default WizardGame;