import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { API } from "../api/apiConfig";
// functions that allow for various sign in/up methods

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await syncUser(user);

    return { firebaseUser: user };
};

export const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await syncUser(user);

    return { firebaseUser: user };
};

export const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await syncUser(user);
    return { firebaseUser: user };
};

export const getToken = async () => {
    return await auth.currentUser.getIdToken();
};

// syncs user with the database
async function syncUser(user) {
    const token = await user.getIdToken();

    const res = await fetch(`${API.AUTH}/sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
};