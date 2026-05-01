import WizardGame from "./WizardGame.js";
import { generateId } from "../utils/IdGenerator.js";

// manages the collection of all currently running games
class GameManager {
    constructor() {
        this.activeGames = new Map();
        this.socketToGame = {};
    }

    // creates a new gameId for the game
    generateGameId() {
        let id;
        do {
            id = generateId();
        } while (this.activeGames.has(id));
        return id;
    }

    // creates a new Wizard game, and adds it into the database
    createGame(dbid) {
        const id = this.generateGameId();
        const newGame = new WizardGame(id, dbid);
        this.activeGames.set(id, newGame);
        return id;
    }

    // retreives game based on its id
    getGame(id) {
        return this.activeGames.get(id);
    }

    // removes game from list of active games once it has been completed/abandoned
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