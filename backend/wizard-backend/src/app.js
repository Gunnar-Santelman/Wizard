import express from "express";
import gameRoutes from "./routes/GameRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import profilePictureRoutes from "./routes/ProfilePictureRoutes.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/game", gameRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/profile-picture", profilePictureRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Wizard API is ruinng"});
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

export default app;