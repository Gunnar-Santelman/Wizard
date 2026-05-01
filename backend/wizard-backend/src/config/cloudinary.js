import { v2 as cloudinary } from "cloudinary";

// sets up cloudinary
cloudinary.config({
    secure: true
});

export default cloudinary;