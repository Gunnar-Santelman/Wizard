import crypto from "crypto";

const idLength = 6;
const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateId = () => {
    let id = "";
    for (let i = 0; i < idLength; i++) {
        const index = crypto.randomInt(0, chars.length);
        id += chars[index];
    }
    return id;
}
