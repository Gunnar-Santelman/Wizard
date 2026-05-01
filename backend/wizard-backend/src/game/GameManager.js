import WizardGame from "./WizardGame.js";
import { finalSaveGameDB } from '../services/GameService.js';
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

    async deleteGame(id) {
        const game = this.activeGames.get(id);
        if (!game) return;

        if (game.resultSaved) return;
        game.resultSaved = true;

        await finalSaveGameDB(game);

        delete this.activeGames[id];

        for (const socketId in this.socketToGame) {
            if (this.socketToGame[socketId] === id) {
                delete this.socketToGame[socketId];
            }
        }
    }
}

export default new GameManager();