import WizardGame from "./WizardGame.js";
import crypto from "crypto";

class GameManager {
    constructor() {
        this.activeGames = new Map();
        this.socketToGame = {};
    }

    createGame() {
        const id = crypto.randomUUID();
        const newGame = new WizardGame(id);
        this.activeGames.set(id, newGame);
        return id;
    }

    getGame(id) {
        return this.activeGames.get(id);
    }

    findGameBySocket(socketId) {
        return Object.values(this.activeGames)
            .filter(game => game && game.players)
            .find(game => game.players.some(player => player.socketId === socketId))
            || null;
    }

    deleteGame(id) {
        delete this.activeGames[id];
    }
}

export default new GameManager();