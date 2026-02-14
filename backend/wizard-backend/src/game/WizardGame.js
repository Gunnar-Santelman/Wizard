class WizardGame {
    constructor (gameId) {
        this.players = [];
        this.maxRounds = 0;
        this.round = 0;
        this.deck = [];
        this.gameId = gameId;
        this.status = "waiting";
    }

    addPlayer(additionalPlayer) {
        this.players.push(additionalPlayer);
    }
    startGame() {
        this.status = "running";
        //this.deck = createDeck();
    }
    getGameState() {
        return  {
            players : this.players,
            round : this.round,
            status : this.status
        }
    }
}

export default WizardGame;