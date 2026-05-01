import * as GameService from '../services/GameService.js';

// endpoint for creating a game to communicate to database
export const createGame = async (req, res) => {
    const gameDBID = await GameService.createGameDB();
    const gameId = GameService.createGameBackend(gameDBID);
    const io = req.app.get("io");
    GameService.createGameSocket(io, gameId);
    return res.json({ id: gameId });
};