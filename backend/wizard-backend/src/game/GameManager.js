import WizardGame from "./WizardGame.js";
import crypto from "crypto";

class GameManager {
    constructor() {
        this.activeGames = new Map();
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
    deleteGame(id) {
        this.activeGames.delete(id);
    }
}

export default new GameManager();