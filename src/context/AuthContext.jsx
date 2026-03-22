import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email, password, name, username) => {
    // Check if username is taken
    const usernameDoc = await getDoc(doc(db, "usernames", username));
    if (usernameDoc.exists()) throw new Error("username-taken");

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });

    // Save user profile to Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      name,
      username,
      email,
      bio: "my personal wishlist — things i love & things i have.",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e2e2b&color=e8e2d5&size=200`,
      createdAt: serverTimestamp(),
    });

    // Reserve username
    await setDoc(doc(db, "usernames", username), { uid: res.user.uid });
    return res;
  };

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
