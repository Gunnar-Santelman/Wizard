import { signInWithGoogle, signUpWithEmail, signInWithEmail } from "../services/authService";
import { useState } from "react";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      const { firebaseUser, needsOnboarding } = await signInWithGoogle();
      onLogin(firebaseUser, needsOnboarding);
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  const handleEmailSignUp = async () => {
    try {
      const { firebaseUser, needsOnboarding } = await signUpWithEmail(email, password);
      onLogin(firebaseUser, needsOnboarding);
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed");
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const { firebaseUser, needsOnboarding } = await signInWithEmail(email, password);
      onLogin(firebaseUser, needsOnboarding);
    } catch (err) {
      console.error(err);
      setError(err.message || "Sign-in failed");
    }
  };

  return (
    <div>
      <h1>Welcome to Wizard!!</h1>
        {/* TODO: Add Input Validation */}
      <div>
        <h2>Sign in / Sign up with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleEmailSignUp}>Sign Up</button>
        <button onClick={handleEmailSignIn}>Sign In</button>
      </div>

      <div>
        <h2>Or sign in with Google</h2>
        <button onClick={handleGoogle}>Sign in with Google</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;