import { auth } from "./firebase";

const API_BASE_USER = process.env.REACT_APP_API_URL + "/api/user";
const API_BASE_PROFILE_PICTURE = process.env.REACT_APP_API_URL + "/api/profile-picture";

export const setUsername = async (username) => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API_BASE_USER}/set-username`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username })
    });

    return await res.json();
};

export const setDefaultProfilePicture = async (profilePictureId) => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API_BASE_PROFILE_PICTURE}/select-default`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profilePictureId })
    });

    return await res.json();
};

export const getOnboardingCompletionStatus = async () => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API_BASE_USER}/onboarding-status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
}