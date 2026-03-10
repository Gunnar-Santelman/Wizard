import { auth } from "./firebase";

const API_BASE_PROFILE_PICTURE = process.env.REACT_APP_API_URL + "/api/profile-picture";

export const uploadProfilePicture = async (file) => {
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE_PROFILE_PICTURE}/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    return await res.json();
};

export const getDefaultProfilePictures = async () => {
    const res = await fetch(`${API_BASE_PROFILE_PICTURE}/defaults`);

    return await res.json();
};