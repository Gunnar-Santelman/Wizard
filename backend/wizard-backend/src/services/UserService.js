import User from "../models/UserSchema.js";

export const updateUsername = async (userId, username) => {
    return await User.findByIdAndUpdate(
        userId,
        { username },
        { new: true }
    );
};

// Returns true if onboarding finished, false if pending
export const getOnboardingStatus = async (userId) => {
    console.log("Looking for user", userId);
    const user = await User.findById(userId, { username: 1, profilePicture: 1 });
    console.log("user:", user);
    if (!user) return false;
    console.log("username:", user.username);
    console.log("profilePicture", user.profilePicture);
    return !!(user.username && user.profilePicture);
};