import { useEffect, useState } from "react";
import { auth } from "../../firebase/Config";
import { onAuthStateChanged } from "firebase/auth";
import {
  registerUser,
  loginUser,
  logoutUser,
  signInWithGoogle,
  uploadProfilePicture,
  updateDisplayName,
} from "../services/authService";
import { AuthContext } from "./AuthContext";
import { getUserProfile } from "../services/userService";
import LoadingScreen from "../../common/components/LoadingScreen";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let profile = await getUserProfile(currentUser.uid);
        if (!profile) {
          console.warn("Perfil no encontrado, reintentando...");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperar 1 segundo
          profile = await getUserProfile(currentUser.uid);
        }
        setUser({
          ...currentUser,
          ...profile,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Métodos de auth
  const loginGoogle = () => signInWithGoogle();
  const login = (email, password) => loginUser(email, password);
  const register = (email, password, displayName) =>
    registerUser(email, password, displayName);
  const logout = () => logoutUser();
  const updateName = (newName) => updateDisplayName(newName);
  const updateProfilePic = (img) => uploadProfilePicture(img);

  const value = {
    user,
    loginGoogle,
    login,
    register,
    logout,
    loading,
    updateName,
    updateProfilePic,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen/> : children}
    </AuthContext.Provider>
  );
}
