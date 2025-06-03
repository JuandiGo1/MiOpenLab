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
  resetPassword,
  updateDataProfile,
  uploadBannerPicture
} from "../services/authService";
import { AuthContext } from "./AuthContext";
import { getUserProfile } from "../services/userService";
import LoadingScreen from "../../common/components/LoadingScreen";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Listen for session changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let profile = await getUserProfile(currentUser.uid);
        if (!profile) {
          console.warn("Profile not found, retrying...");
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
  const updateBannerPic = (img) => uploadBannerPicture(img);
  const resetPass = (email) => resetPassword(email);
  const updateUserProfile = (profileData) => updateDataProfile(profileData);

  const value = {
    user,
    loginGoogle,
    login,
    register,
    logout,
    loading,
    updateName,
    updateProfilePic,
    updateBannerPic,
    resetPass,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
