import * as GameService from '../services/GameService.js';

export const createGame = async (req, res) => {
    const gameDBID = await GameService.createGameDB();
    const gameId = GameService.createGameBackend(gameDBID);
    const io = req.app.get("io");
    GameService.createGameSocket(io, gameId);
    return res.json({ id: gameId });
};