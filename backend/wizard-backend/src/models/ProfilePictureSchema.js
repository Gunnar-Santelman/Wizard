import mongoose from "mongoose";

const profilePictureSchema = new mongoose.Schema(
    {
        publicId: {
            type: String,
            required: true,
            unique: true
        },
        url: {
            type: String,
            required: true
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false
        },
        owner: {
            type: String,
            default: null
        }
    }
);

export default mongoose.model("ProfilePicture", profilePictureSchema, "profilePictures");