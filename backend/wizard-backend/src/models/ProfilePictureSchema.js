import mongoose from "mongoose";

const profilePictureSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["default", "personal"],
            required: true
        },
        url: {
            type: String,
            required: true,
            unique: true
        }
    }
);

export default mongoose.model("ProfilePicture", profilePictureSchema, "profilePictures");