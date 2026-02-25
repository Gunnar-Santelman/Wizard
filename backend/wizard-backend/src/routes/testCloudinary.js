import express from "express";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/cloudinary-test", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ max_results: 1 });

    res.json({
      message: "Cloudinary connected!",
      total: result.total_count,
      resources: result.resources,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cloudinary connection failed",
      error: err.message,
    });
  }
});

export default router;