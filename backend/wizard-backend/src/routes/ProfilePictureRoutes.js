import express from "express";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {
    uploadProfilePicture,
    selectDefaultProfilePicture,
    getDefaultProfilePictures
} from "../controllers/ProfilePictureController.js";

// routes for uploading or retrieving profile pictures
const router = express.Router();

router.post(
    "/upload",
    authenticate,
    upload.single("image"),
    uploadProfilePicture
);

router.post(
    "/select-default",
    authenticate,
    selectDefaultProfilePicture
);

router.get(
    "/defaults",
    getDefaultProfilePictures
);

export default router;