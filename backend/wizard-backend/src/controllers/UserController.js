import * as UserService from "../services/UserService.js";

export const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user.uid;

        if (!username || username.length < 4 || username.length > 16) {
            return res.status(400).json({
                message: "Username must be 4–16 characters"
            });
        }

        const user = await UserService.updateUsername(userId, username);

        return res.json({
            message: "Username set successfully",
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error setting username"
        });
    }
};

export const hasCompletedOnboarding = async (req, res) => {
    try {
        const userId = req.user.uid;
        console.log("UID from token:", userId);
        const hasCompletedOnboarding = await UserService.getOnboardingStatus(userId);

        return res.json({
            message: "Collected onboarding completion status",
            completedOnboarding: hasCompletedOnboarding
        });
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error getting onboarding completion status"
        });
    }
};