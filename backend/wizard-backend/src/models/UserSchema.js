import mongoose from "mongoose";

// Subcollection for user achievements
const userAchievementSchema = new mongoose.Schema(
    {
        achievementId: {
            type: String,
            required: true
        },
        achievedAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        _id: { // Must pass in Firebase UID when creating user/finding user
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            trim: true, // removes leading and ending whitespace
            minlength: 4,
            maxlength: 16
        },
        lastActive: {
            type: Date,
            default: Date.now
        },
        statistics: { 
            type: Map,
            of: Number,
            default: {
                gamesPlayed: 0,
                gamesWon: 0,
                gamesLost: 0 // Can add more statistics later
            }
        },
        friends: {
            type: [String],
            default: []
        },
        achievements: {
            type: [userAchievementSchema],
            default: []
        },
        profilePic: {
            type: String,
            default: ""
        }
    },
    { timestamps: true } // Creates createdAt and updatedAt automatically
);

export default mongoose.model("User", userSchema, "users");