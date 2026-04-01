import Game from '../models/Game.js';

export const initializeGameDB = async () => {
    const newGame = new Game();

    await newGame.save();

    return newGame._id.toString();
}

export const updateGameDB = async (gameId, updateData) => {
    const updatedGame = await Game.findByIdAndUpdate(
        gameId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedGame;
};