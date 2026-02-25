import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: ""
        }
    }
);

export default mongoose.model("Achievement", achievementSchema, "achievements");