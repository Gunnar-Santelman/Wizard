import express from "express";
import authenticate from "../middleware/auth.js";
import { updateUsername, hasCompletedOnboarding } from "../controllers/UserController.js";

const router = express.Router();

router.post("/set-username", authenticate, updateUsername);

router.get("/onboarding-status", authenticate, hasCompletedOnboarding);

export default router;