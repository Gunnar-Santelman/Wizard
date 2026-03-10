import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

const API_BASE_AUTH = process.env.REACT_APP_API_URL + "/api/auth";

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const data = await syncUser(user);

    return { firebaseUser: user };
};

export const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const data = await syncUser(user);

    return { firebaseUser: user };
};

export const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const data = await syncUser(user);
    return { firebaseUser: user };
};

async function syncUser(user) {
    const token = await user.getIdToken();

    const res = await fetch(`${API_BASE_AUTH}/sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    return await res.json();
}