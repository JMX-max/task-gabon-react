import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const requestCode = async (email) => {
    const res = await fetch(`${API_URL}/api/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Impossible d'envoyer le code");
    }

    return data;
  };

  const registerWithCode = async ({ name, email, password, code }) => {
    const verify = await fetch(`${API_URL}/api/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const verifyData = await verify.json();
    if (!verify.ok) {
      throw new Error(verifyData.message || "Code invalide");
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(cred.user, {
      displayName: name,
    });

    return cred.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        requestCode,
        registerWithCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}