import express from "express";
const app = express();

 app.get("/", (req, res) => {
   res.send("Hello Express v2!");
});

export default app;