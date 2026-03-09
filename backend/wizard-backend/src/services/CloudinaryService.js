import cloudinary from "../config/cloudinary.js";

export const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};