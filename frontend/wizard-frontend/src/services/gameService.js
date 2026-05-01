import { auth } from "./firebase";
import { API } from "../api/apiConfig";

// endpoint to create the game
export async function createGame() {
    const token = await auth.currentUser.getIdToken();

    const res = await fetch(`${API.GAME}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to create game");
    }

    return res.json();
}