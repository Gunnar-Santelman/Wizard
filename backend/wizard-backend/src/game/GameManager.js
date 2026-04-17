import WizardGame from "./WizardGame.js";
import { generateId } from "../utils/IdGenerator.js";

class GameManager {
    constructor() {
        this.activeGames = new Map();
        this.socketToGame = {};
    }

    generateGameId() {
        let id;
        do {
            id = generateId();
        } while (this.activeGames.has(id));
        return id;
    }

    createGame(dbid) {
        const id = this.generateGameId();
        const newGame = new WizardGame(id, dbid);
        this.activeGames.set(id, newGame);
        return id;
    }

    getGame(id) {
        return this.activeGames.get(id);
    }
    // Does not work since this.activeGames is a Map
    findGameBySocket(socketId) {
        return Object.values(this.activeGames)
            .filter(game => game && game.players)
            .find(game => game.players.some(player => player.socketId === socketId))
            || null;
    }

    deleteGame(id) {
        delete this.activeGames[id];

        for (const socketId in this.socketToGame) {
            if (this.socketToGame[socketId] === id) {
                delete this.socketToGame[socketId];
            }
        }
    }
}

export default new GameManager();