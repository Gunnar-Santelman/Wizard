import UserSchema from "../models/UserSchema.js";

export default class User {
    static async create(username) {
        if (!username) {
            throw new Error("Username required");
        }

        return await UserSchema.create({ username })
    }
}