import {  useEffect, useState } from "react";
import { auth } from "../../firebase/Config";
import { onAuthStateChanged} from "firebase/auth";
import { registerUser, loginUser, logoutUser, signInWithGoogle } from "../services/authService";
import { AuthContext } from "./AuthContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Métodos de auth
  const loginGoogle = () => signInWithGoogle();
  const login = (email, password) => loginUser(email, password);
  const register = (email, password, displayName) => registerUser(email, password, displayName);
  const logout = () => logoutUser();


  const value = {
    user,
    loginGoogle,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Cargando sesión...</div> : children}
    </AuthContext.Provider>
  );
}


