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
            default: false
        },
        owner: {
            type: String, // Firebase UID
            default: null
        }
    }
);

export default mongoose.model("ProfilePicture", profilePictureSchema, "profilePictures");