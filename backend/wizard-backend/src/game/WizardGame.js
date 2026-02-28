class WizardGame {
    constructor (gameId) {
        this.id = gameId;
        this.host = null;
        this.players = [];
        this.maxRounds = 0;
        this.currentRound = 0;
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
        
        this.players.push({
            name: playerName,
            socketId: socketId,
            // test hand
            hand: [ {suit: "spades", value:2}, {suit: "hearts", value:14}, {suit: "clubs", value:3}, {suit: "diamonds", value:4}, {suit: "spades", value:13}, {suit: "diamonds", value:12}, {suit: "clubs", value:11}, {suit: "hearts", value:10},]
        });
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
        //this.deck = createDeck();
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