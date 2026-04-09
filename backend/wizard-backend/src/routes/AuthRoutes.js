import express from "express";
import authenticate from "../middleware/auth.js";
import { syncUser } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/sync", authenticate, syncUser);

export default router;