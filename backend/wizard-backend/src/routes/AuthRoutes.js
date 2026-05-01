import express from "express";
import { authenticate } from "../middleware/auth.js";
import { syncUser } from "../controllers/AuthController.js";

// sets up router for authentication
const router = express.Router();

router.post("/sync", authenticate, syncUser);

export default router;