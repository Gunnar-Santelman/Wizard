import Game from '../models/GameSchema.js';
import GameManager from '../game/GameManager.js';

export const createGameDB = async () => {
    const newGame = new Game();

    await newGame.save();

    return newGame._id;
};

export const startGameDB = async (game) => {
    return await Game.findByIdAndUpdate(game.dbid, {
        status: "running",
        players: game.players.map(p => p.uid),
        host: game.host.uid
    });
};

export const abandonGameDB = async (game) => {
    return await Game.findByIdAndUpdate(game.dbid, {
        status: "abandoned",
    });
};

export const finishGameDB = async (game) => {
    return await Game.findByIdAndUpdate(game.dbid, {
        status: "finished",
        winner: [game.gameWinner.uid],
        finishedAt: new Date()
    });
};

export const updateGameDB = async (gameId, updateData) => {
    const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedGame;
};

export const createGameBackend = (dbid) => {
    const gameId = GameManager.createGame(dbid);
    return gameId;
};

export const createGameSocket = (io, gameId) => {
    io.emit("gameCreated", gameId);
};