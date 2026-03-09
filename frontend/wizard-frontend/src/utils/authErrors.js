export const getAuthErrorMessage = (error) => {
    switch (error.code) {
        case "auth/wrong-password":
            return "Incorrect password.";
        case "auth/user-not-found":
            return "No account exists with this email.";
        case "auth/email-already-in-use":
            return "This email is already registered."
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/weak-password":
            return "Password must be at least 8 characters.";
        case "auth/invalid-credential":
            return "Email and/or password are incorrect.";
        default:
            return "Authentication failed.";
    }
};