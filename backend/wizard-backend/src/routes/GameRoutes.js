import gameManager from "./../game/GameManager.js";
import express from "express";
const router = express.Router();

router.post("/create", (req, res) => {
    const gameId = gameManager.createGame();

    const io = req.app.get("io");
    io.emit("gameCreated", gameId);

    res.json({id: gameId});
})

router.post("/:id/join", (req, res) => {
    const game = gameManager.getGame(req.params.id);
    if (!game) {
        return res.status(404).json({error: "Game not found"});
    }

    const { name } = req.body;
    if (!name) {
        return res.status(400).json({error: "Name required"});
    }

    game.joinGame(name);
    res.json(game.getGameState());
})

router.post("/:id/start", (req,res) => {
    const game = gameManager.getGame(req.params.id);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }

    game.startGame();
    res.json(game.getGameState());
})

router.get("/:id", (req, res) => {
    const game = gameManager.getGame(req.params.id);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }

    res.json(game.getGameState());
})

export default router;