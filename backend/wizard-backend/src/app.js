import express from "express";
import User from "./User.js";
const app = express();

 app.get("/", (req, res) => {
   res.send("Hello Express v2!");
});

// app.get("/test-user", async(req, res) => {
//   const user = await User.create({
//     username: "testuser",
//     password: "FunTimesForevers"
//   });
//   res.json(user);
// })

export default app;