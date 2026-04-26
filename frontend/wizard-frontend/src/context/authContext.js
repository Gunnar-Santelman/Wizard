import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getAllUserInfo } from "../services/userService";

const AuthContext = createContext();

// sets up the various authorizations for user data
export function AuthProvider({ children }) {

  const [user, setUser] = useState(undefined);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // sets default user data
  const defaults = {
    username: "",
    statistics: new Map(),
    friends: [],
    profilePicture: null,
    lastActive: null,
    achievements: [],
    createdAt: null,
    updatedAt: null,
    completedOnboarding: false
  };

  // takes in the data and updates the user data with the proper syntax
  const normalizeUserData = (data) => {
    return Object.fromEntries(
      Object.entries(defaults).map(([key, defaultValue]) => {
        let value = data?.[key];

      // Handle special types
        if (key === "statistics") {
          return [key, value instanceof Map ? value : new Map(Object.entries(value || {}))];
        }
        if (["lastActive", "createdAt", "updatedAt"].includes(key)) {
          return [key, value ? new Date(value) : null];
        }

      // Return value or default
        return [key, value !== undefined ? value : defaultValue];
      })
    );
  };

  const serializeUserData = (data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (key === "statistics") return [key, Object.fromEntries(value)];
        if (["lastActive", "createdAt", "updatedAt"].includes(key))
          return [key, value instanceof Date && !isNaN(value) ? value.toISOString() : null];
        return [key, value];
      })
    );
  };

  const refreshUserData = async (currentUser) => {

    if (!currentUser) return;

    setLoading(true);
    const data = await getAllUserInfo();
    console.log("Fetched user data:", data);
    if (!data.userInfo) {
      console.error("No user data returned.");
      return;
    }
    const normalized = normalizeUserData(data.userInfo);

    setUserData(normalized);
    localStorage.setItem("userData", JSON.stringify(serializeUserData(normalized)));
    setLoading(false);
  };

  const updateUserData = (updater) => {
    setUserData(prev => {
      const updated = typeof updater === "function" ? updater(prev) : updater;

      localStorage.setItem("userData", JSON.stringify(serializeUserData(updated)));

      return updated;
    });
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      setUser(firebaseUser);

      if (!firebaseUser) {
        localStorage.removeItem("userData");
        setLoading(false);
        return;
      }

      const cached = localStorage.getItem("userData");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setUserData(normalizeUserData(parsed));;
        } catch (err) {
          console.error("Failed to parse cached user data", err);
        }
      }

      try {
        await refreshUserData(firebaseUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }

      setLoading(false);

    });

    return unsubscribe;

  }, []);

  // returns the user along with their data and the functions to refresh/update the data
  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        refreshUserData,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}