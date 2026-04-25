import User from "../models/UserSchema.js";

export const updateUsername = async (userId, username) => {
    return await User.findByIdAndUpdate(
        userId,
        { username },
        { new: true }
    );
};

export const getUsername = async (userId) => {
    const user = await User.findById(userId, { username: 1 });
    return user.username;
}

export const getAllUserInfo = async (userId) => {
    const user = await User.findById(userId).populate("profilePicture");

    if (!user) {
        return {
            completedOnboarding: false
        }
    };
    return {
        username: user.username,
        statistics: user.statistics,
        friends: user.friends,
        profilePicture: user.profilePicture?.url || null,
        lastActive: user.lastActive,
        achievements: user.achievements,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        completedOnboarding: !!(user.username && user.profilePicture)
    };
}

export const updateGamesWon = async (userId) => {
    return await User.updateOne(
        { _id: userId },
        { $inc: { "statistics.gamesWon": 1 } }
    )
}

export const updateGamesPlayed = async (userIds) => {
    return await User.updateMany(
        { _id: { $in: userIds } },
        { $inc: { "statistics.gamesPlayed": 1 } }
    );
};

export const updateGamesLost = async (userIds) => {
    return await User.updateMany(
        { _id: { $in: userIds } },
        { $inc: { "statistics.gamesLost": 1 } }
    );
};

// Returns true if onboarding finished, false if pending
export const getOnboardingStatus = async (userId) => {
    const user = await User.findById(userId, { username: 1, profilePicture: 1 });
    if (!user) return false;
    return !!(user.username && user.profilePicture);
};