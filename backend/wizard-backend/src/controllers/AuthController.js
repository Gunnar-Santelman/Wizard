import * as AuthService from "../services/AuthService.js";

export const syncUser = async (req, res) => {
    try {
        const { uid } = req.user;

        const user = await AuthService.syncUser(uid);

        return res.status(200).json({
            message: "User synced successfully",
            user: {
                id: user._id,
                username: user.username,
                statistics: user.statistics
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};