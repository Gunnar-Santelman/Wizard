import Game from '../models/GameSchema.js';
import GameManager from '../game/GameManager.js';
import { updateGamesWon, updateGamesLost, updateGamesPlayed } from './UserService.js';

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

export const finalSaveGameDB = async (game) => {
    console.log("Game Status:", game.status);
    switch (game.status) {
        case "waiting":
            return await deleteGameDB(game.dbid);
        case "running":
            return await abandonGameDB(game.dbid);
        case "complete":
            return await finishGameDB(game);
        default:
            return;
    }
};

export const deleteGameDB = async (dbid) => {
    return await Game.findByIdAndDelete(dbid);
};

export const abandonGameDB = async (dbid) => {
    return await Game.findByIdAndUpdate(dbid, {
        status: "abandoned"
    });
};

export const finishGameDB = async (game) => {
    const playerIds = game.playerIdsAtStart;
    console.log("Player IDs:", playerIds);
    const winnerId = game.gameWinner.uid;
    const loser_Ids = playerIds.filter(id => id !== winnerId);
    console.log("Loser IDs:", loser_Ids);

    await Promise.all([
        updateGamesPlayed(playerIds),
        updateGamesWon(winnerId),
        updateGamesLost(loser_Ids)
    ]);

    return Game.findByIdAndUpdate(game.dbid, {
        status: "finished",
        winner: game.winner
    });
}

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