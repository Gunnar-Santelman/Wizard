import { auth } from "./firebase";
import { API } from "../api/apiConfig";

// endpoint that allows user to upload a custom profile picture from their computer
export const uploadProfilePicture = async (file) => {
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API.PROFILE_PICTURE}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    return await res.json();
};

// fetches the default profile picture options
export const getDefaultProfilePictures = async () => {
    const res = await fetch(`${API.PROFILE_PICTURE}/defaults`);

    return await res.json();
};