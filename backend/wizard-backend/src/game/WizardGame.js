import Round from "./engine/Round.js";
import Card from "./engine/Card.js";
import Player from "./engine/Player.js";

// main game class that manages overall game state
export class WizardGame {
    // creates the necessary class variables the game must track
    constructor (gameId, dbid) {
        this.id = gameId;
        this.dbid = dbid;
        this.resultSaved = false;
        this.playerIdsAtStart = [];
        this.host = null;
        this.players = [];
        this.maxRounds = 0;
        this.currentRound = null;
        this.status = "waiting";
        this.gameWinner = null;
    }

    // creates a new player and adds them to the list of current players
    joinGame(playerName, profilePicture, socketId, uid) {
        const alreadyExists = this.players.find(
            p => p.socketId === socketId
        );

        if (alreadyExists) {
            return;
        };

        const newPlayer = new Player(socketId, uid, playerName, profilePicture);

        if (this.players.length === 0) {
            this.host = newPlayer;
        };

        this.players.push(newPlayer);
    }

    // ends the game, and determines the winner
    finishGame() {
        //Save stats to database
        this.gameWinner = this.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
        console.log(this.gameWinner);
        this.status = "complete";
    }
    
    // removes a player from the list of players
    removePlayer(socketId) {
        this.players = this.players.filter(
            p => p.socketId !== socketId
        );
        if (socketId === this.host?.socketId && this.players.length !== 0 && this.status === "waiting") {
            this.host = this.players[0];
        }
    }

    // begins the game at round 1
    startGame() {
        this.status = "running";
        this.maxRounds = 60 / this.players.length;
        this.currentRound = new Round(1, this);
        this.playerIdsAtStart = this.players.map(p => p.uid);
    }

    isEmpty() {
        return this.players.length === 0;
    }
    
    // basic game state used for lobby information
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