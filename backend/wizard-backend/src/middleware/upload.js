import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "wizard/profile_pictures",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{
            width: 256,
            height: 256,
            crop: "fill"
        }]
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

export default upload;