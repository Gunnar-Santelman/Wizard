import ProfilePicture from "../models/ProfilePictureSchema.js";
import User from "../models/UserSchema.js";
import * as CloudinaryService from "./CloudinaryService.js";

export const uploadProfilePicture = async (userId, file) => {

    const user = await User.findById(userId).populate("profilePicture");

    if (!user) {
        throw new Error("User not found");
    }

    if (
        user.profilePicture &&
        !user.profilePicture.isDefault &&
        user.profilePicture.owner === userId
    ) {
        await CloudinaryService.deleteImage(user.profilePicture.publicId);
        await ProfilePicture.findByIdAndDelete(user.profilePicture._id);
    }

    const newPic = await ProfilePicture.create({
        publicId: file.filename,
        url: file.path,
        owner: userId
    });

    user.profilePicture = newPic._id;
    await user.save();

    return newPic;
};


export const selectDefaultProfilePicture = async (userId, profilePictureId) => {

    const pic = await ProfilePicture.findById(profilePictureId);

    if (!pic || !pic.isDefault) {
        throw new Error("Invalid default picture");
    }

    await User.findByIdAndUpdate(userId, {
        profilePicture: pic._id
    });

};

// Returns URLs along with object id
export const getDefaultPictureURLs = async () => {
    return await ProfilePicture.find({ isDefault: true }, { url: 1 }).lean();
};