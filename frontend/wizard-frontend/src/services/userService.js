import { auth } from "./firebase";
import { API } from "../api/apiConfig";

export const setUsername = async (username) => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API.USER}/set-username`, {
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

    const res = await fetch(`${API.PROFILE_PICTURE}/select-default`, {
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

    const res = await fetch(`${API.USER}/onboarding-status`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
}