import mongoose from "mongoose";

// connects with the Mongo database via the .env file
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

export default connectDB;