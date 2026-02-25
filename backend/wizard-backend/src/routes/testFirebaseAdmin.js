import express from "express";
import admin from "../config/firebaseAdmin.js";

const router = express.Router();

router.get("/firebase-admin-test", async (req, res) => {
  try {
    const list = await admin.auth().listUsers(1);
    
    res.json({ 
      message: "Firebase Admin connected!", 
      totalUsers: list.users.length,
      users: list.users
    });
    
  } catch (err) {
    res.status(500).json({ message: "Firebase Admin test failed", error: err.message });
  }
});

export default router;
