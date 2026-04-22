import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
} from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { getAuthErrorMessage } from "../utils/authErrors";
import "../styling/LoginPage.css";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // Only use "signin", "signup", "google", or null
  const [mode, setMode] = useState("signin"); // Only use "signin" or "signup"

  const navigate = useNavigate();

  const validateInputs = () => {
    const errors = [];

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    return errors.length ? errors.join("\n") : null;
  };

  const runAuthAction = async (actionName, authFunction) => {
    try {
      setLoadingAction(actionName);
      setError("");

      await authFunction();

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogle = async () => {
    runAuthAction("google", signInWithGoogle);
  };

  const handleEmailAuth = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (mode === "signin") {
      runAuthAction("signin", () => signInWithEmail(email, password));
    } else {
      runAuthAction("signup", () => signUpWithEmail(email, password));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to Wizard</h1>

        <div className="input-group">
          <h2 className="instruction">
            {mode === "signin" ? "Sign in with Email" : "Create an Account"}
          </h2>

          <input
            className="email-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <input
            className="password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          {mode === "signup" && (
            <p className="password-instruction">
              **Password must be 8-50 characters.**
            </p>
          )}

          <button
            className="primary-btn"
            disabled={loadingAction !== null}
            onClick={handleEmailAuth}
          >
            {loadingAction === "signin" && mode === "signin"
              ? "Signing in..."
              : loadingAction === "signup" && mode === "signup"
                ? "Creating account..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
          </button>
          {error && <p className="error-text">{error}</p>}

          <hr />

          <p>
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              className="link-btn"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
          <p>OR</p>

          <button
            className="google-btn"
            disabled={loadingAction !== null}
            onClick={handleGoogle}
          >
            {loadingAction === "google"
              ? "Signing in..."
              : "Continue with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
