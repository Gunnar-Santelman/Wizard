import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        host: {
            type: String,
            required: true
        },
        players: { 
            type: [String],
            required: true,
            validate: [arr => arr.length > 0, 'At least one player required']
        },
        status: {
            type: String,
            enum: ["waiting", "running", "finished", "abandoned"],
            default: "waiting"
        },
        winner: {
            type: [String],
            default: []
        },
        finishedAt: {
            type: Date,
            default: null
        },
        isPublic: { 
            type: Boolean,
            required: true
        },
        passwordHash: {
            type: String, // Uses bcrypt
            default: null
        }
    },
    { timestamps: true } // Creates createdAt and updatedAt automatically
);

export default mongoose.model("Game", gameSchema, "games");