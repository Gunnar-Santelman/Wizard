import mongoose from "mongoose";

const profilePictureSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true
        }
    }
);

export default mongoose.model("ProfilePicture", profilePictureSchema, "profilePictures");