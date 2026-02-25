import express from "express";
import gameRoutes from "./routes/GameRoutes.js";
import profilePictureRoutes from "./routes/ProfilePictureRoutes.js";
import testFirebaseAdmin from "./routes/testFirebaseAdmin.js";
import testCloudinary from "./routes/testCloudinary.js";
import cors from "cors";
const app = express();

// app.get("/", (req, res) => {
//    res.send("Hello Express v2!");
// });

app.use(cors());
app.use(express.json());

app.use("/api/game", gameRoutes);
app.use("/api/profile-picture", profilePictureRoutes)
app.use("/api/firebase-test", testFirebaseAdmin) // /api/firebase-test/firebase-admin-test
app.use("/api/cloudinary-test", testCloudinary) // /api/cloudinary-test/cloudinary-test

app.get("/", (req, res) => {
  res.json({ message: "Wizard API is ruinng"});
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
})

export default app;