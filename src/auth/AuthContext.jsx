import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [plan, setPlan] = useState(null);
  const [freeTrialsLeft, setFreeTrialsLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= SIGNUP ================= */
  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const fbUser = userCredential.user;

      await setDoc(doc(db, "users", fbUser.uid), {
        name,
        email,
        role: "client",
        plan: "free",
        freeTrialsLeft: 8,
        createdAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error("Signup error:", error.message);
      return false;
    }
  };

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error.message);
      return false;
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setPlan(null);
    setFreeTrialsLeft(0);
  };

  /* ================= AUTH STATE ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));

          if (snap.exists()) {
            const data = snap.data();
            setRole(data.role || null);
            setPlan(data.plan || null);
            setFreeTrialsLeft(data.freeTrialsLeft ?? 0);
          } else {
            setRole(null);
            setPlan(null);
            setFreeTrialsLeft(0);
          }
        } catch (err) {
          console.error("Firestore fetch error:", err);
          setRole(null);
        }
      } else {
        setRole(null);
        setPlan(null);
        setFreeTrialsLeft(0);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        plan,
        freeTrialsLeft,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
