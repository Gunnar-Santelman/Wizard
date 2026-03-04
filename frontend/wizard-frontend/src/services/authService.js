const API_BASE_AUTH = process.env.REACT_APP_API_URL + "/api/auth";
const API_BASE_PROFILE_PICTURE = process.env.REACT_APP_API_URL + "/api/profile-picture";

import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const token = await user.getIdToken();

    await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    });

    const data = await res.json();

    return { firebaseUser: user, needsOnboarding: data.needsOnboarding };
};

export const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    return { firebaseUser: user, needsOnboarding: data.needsOnboarding };
};

export const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    return { firebaseUser: user, needsOnboarding: data.needsOnboarding };
};

export const setUsername = async (username) => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch("http://localhost:5000/api/auth/set-username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username })
    });

    return await res.json();
};

export const uploadProfilePicture = async (file) => {
    const token = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/profile-picture/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    return await res.json();
};

export const selectDefaultProfilePicture = async (profilePictureId) => {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch("http://localhost:5000/api/profile-pictures/select-default", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profilePictureId })
    });

    return await res.json();
};