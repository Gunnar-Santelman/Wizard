export const validateEmail = (email) => {
    if (!email) return "Email is required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Invalid email address";

    return null;
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";

    if (password.length < 8 || password.length > 50) return "Password must be 8 to 50 characters";

    return null;
};

export const validateUsername = (username) => {
    if (!username) return "Username is required";

    if (username.trim() !== username) {
        return "Username cannot start or end with spaces";
    }

    if (username.length < 4 || username.length > 16) {
        return "Username must be 4 to 16 characters";
    }

    const validUsernamePattern = /^[A-Za-z0-9_ ]+$/;

    if (!validUsernamePattern.test(username)) {
        return "Username can only contain letters, numbers, spaces, and underscores";
    }

    if (username.includes("  ")) {
        return "Username cannot contain consecutive spaces";
    }

    return null;
}