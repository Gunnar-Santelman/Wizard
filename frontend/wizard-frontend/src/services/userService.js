import { auth } from "./firebase";
import { API } from "../api/apiConfig";
// various functions that allow retrieval/setting of various pieces of user data

// post request to set username
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

// get request to retrieve username of specific user
export const getUsername = async () => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API.USER}/get-username`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
};

// get request to retrieve all user data based on the user's token
export const getAllUserInfo = async () => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API.USER}/get-all-info`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
};

// sets profile picture to one of the default options as selected by the user
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

// checks whether onboarding was properly completed
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