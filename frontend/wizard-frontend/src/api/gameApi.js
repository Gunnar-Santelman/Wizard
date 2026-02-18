const API_BASE = process.env.REACT_APP_API_URL + "/api/game";

export async function createGame() {
    const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Failed to create game");
    }

    return res.json();
}

export async function joinGame(gameId, name) {
    const res = await fetch(`${API_BASE}/${gameId}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) {
        throw new Error("Failed to join game");
    }
    
    return res.json();
}

export async function startGame(gameId) {
    const res = await fetch(`${API_BASE}/${gameId}/start`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Failed to start game");
    }

    return res.json();
}

export async function getGameState(gameId) {
    const res = await fetch(`${API_BASE}/${gameId}`);

    if (!res.ok) {
        throw new Error("Failed to get game state");
    }

    return res.json();
}