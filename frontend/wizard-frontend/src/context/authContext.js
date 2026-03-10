import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getOnboardingCompletionStatus } from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(undefined);
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      setUser(firebaseUser);

      if (!firebaseUser) {
        setOnboardingComplete(null);
        return;
      }

      const { completedOnboarding } = await getOnboardingCompletionStatus();
      console.log("Fetched onboarding status in authcontext:", completedOnboarding);
      setOnboardingComplete(completedOnboarding);

    });

    return unsubscribe;

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        onboardingComplete,
        setOnboardingComplete
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}