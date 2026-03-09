import User from "../models/UserSchema.js";

export const syncUser = async (uid) => {
    let user = await User.findById(uid);

    if (!user) {
        user = await User.create({
            _id: uid
        });

        console.log("Created new user:", uid);
    } else {
        user.lastActive = new Date();
        await user.save();
    }

    return user;
};