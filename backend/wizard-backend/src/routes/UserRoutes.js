import express from "express";
import authenticate from "../middleware/auth.js";
import { updateUsername, getUsername, hasCompletedOnboarding, getAllUserInfo } from "../controllers/UserController.js";

const router = express.Router();

router.post("/set-username", authenticate, updateUsername);

router.get("/get-username", authenticate, getUsername);

router.get("/get-all-info", authenticate, getAllUserInfo);

router.get("/onboarding-status", authenticate, hasCompletedOnboarding);

export default router;