export const validateEmail = (email) => {
    if (!email) return "Email is required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return "Invalid email address";

    return null;
};

export const validatePassword = (password, mode = "signin") => {
    switch (mode) {
        case "signin":
            return validatePasswordLogin(password);
        case "signup":
        case "update":
            return validatePasswordCreation(password);
        default:
            return validatePasswordLogin(password);
    }
};

export const validatePasswordLogin = (password) => {
    if (!password) return "Password is required";

    return null;
};

export const validatePasswordCreation = (password) => {
    if (!password) return "Password is required";

    const errors = [];

    if (password.length < 8 || password.length > 50) {
        errors.push("Password must be 8 to 50 characters");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must include at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("Password must include at least one number");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push("Password must include at least one special character");
    }

    return errors.length > 0 ? errors.join("\n") : null;
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