import gameManager from "./../game/GameManager.js";
import express from "express";
import { authenticate } from "../middleware/auth.js";
import { createGame } from "../controllers/GameController.js";

const router = express.Router();

router.post("/create", authenticate, createGame);

export default router;