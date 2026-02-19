import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        wins: {
            type: Number, 
            default: 0
        },
        losses: {
            type: Number,
            default: 0
        }
    }
);

export default mongoose.model("User", userSchema);