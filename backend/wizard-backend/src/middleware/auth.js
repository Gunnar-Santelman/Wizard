import admin from "../config/firebaseAdmin.js";

export const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split("Bearer ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;

    next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const verifyToken = async (token) => {
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        return decoded.uid;
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};