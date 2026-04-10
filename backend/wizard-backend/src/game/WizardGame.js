import Round from "./engine/Round.js";
import Card from "./engine/Card.js";
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

    joinGame(playerName, profilePicture, socketId) {
        if (this.players.length === 0) {
            this.host = socketId;
        }

        const alreadyExists = this.players.find(
            p => p.socketId === socketId
        );

        if (alreadyExists) {
            return;
        }
        this.players.push(
            new Player(socketId, playerName, profilePicture)
        );
    }

    finishGame() {
        //Save stats to database
        this.status = "complete";
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
        this.currentRound = new Round(1, this);
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