import { auth, storage} from "../../firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail 
} from "firebase/auth";
import { createUserProfile, createUserProfileIfNotExists, updateName, ensureUserFields, updateUserProfile } from "./userService";

import { updateUserCommentsProfile } from "../../common/services/commentService";

const googleProvider = new GoogleAuthProvider();


export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Crear perfil personalizado si no existe
    await createUserProfileIfNotExists({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || "",
    });

    // Asegurar campos nuevos
    await ensureUserFields(user.uid);

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function registerUser(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Crear perfil adicional en Firestore
    await createUserProfile({
      uid: user.uid,
      displayName,
      photoURL: user.photoURL || "", // opcionalmente una por defecto
    });

    return { success: true, user: user };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return { success: false, message: "The email is already in use. Please use another one." };
    } else if (error.code === "auth/invalid-email") {
      return { success: false, message: "The email is invalid. Please check the format." };
    } else if (error.code === "auth/weak-password") {
      return { success: false, message: "The password is too weak. Use at least 6 characters." };
    } else {
      return { success: false, message: "An unknown error occurred. Please try again."+ error.message };
    }
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user
    // Crear perfil personalizado si no existe
    await createUserProfileIfNotExists({
      uid: user.uid,
      displayName: user.displayName,
      username: user.displayName.replace(/\s+/g, "").toLowerCase(),
      photoURL: user.photoURL || "",
    });

    // Asegurar campos nuevos
    await ensureUserFields(user.uid);

    return { success: true, user: user };
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return { success: false, message: "User not found. Please check your email" };
    } else if (error.code === "auth/invalid-credential") {
      return { success: false, message: "Invalid password or email. Please try again." };
    } else if (error.code === "auth/invalid-email") {
      return { success: false, message: "Invalid email. Please check the format." };
    } else if (error.code === "auth/too-many-requests") {
      return { success: false, message: "Too many failed attempts. Please try again." };
    } else {
      return { success: false, message: "An unknown error occurred. Please try again." + error.message};
    }
  }
}

export async function logoutUser() {
  await signOut(auth);
}


export async function uploadProfilePicture(file) {
  if (!auth.currentUser) throw new Error("There is no authenticated user.");

  // Validar tipo de archivo
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only PNG, JPG, JPEG, and WEBP images are allowed.");
  }
  
  const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

  // Sube la imagen al Storage
  await uploadBytes(storageRef, file);
  try {
    // Obtiene la URL pública
    const photoURL = await getDownloadURL(storageRef);
    
    // Actualizar todo en una secuencia para mantener la consistencia
    await Promise.all([
      updateProfile(auth.currentUser, { photoURL }),
      updateUserPhotoURL(auth.currentUser.uid, photoURL),
      updateUserCommentsProfile(auth.currentUser.uid, photoURL, auth.currentUser.displayName)
    ]);

    console.log("Profile picture and comments updated:", photoURL);
    return photoURL;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
}

export async function uploadBannerPicture(file) {
  if (!auth.currentUser) throw new Error("There is no authenticated user.");

  // Validar tipo de archivo
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    console.error("Invalid file type:", file.type);
    throw new Error("Only PNG, JPG, JPEG, and WEBP images are allowed.");
  }

  const storageRef = ref(storage, `banners/${auth.currentUser.uid}`);

  // Sube la imagen al Storage
  await uploadBytes(storageRef, file);

  // Obtiene la URL pública
  const bannerURL = await getDownloadURL(storageRef);
  console.log("Banner picture updated:", bannerURL);

  // Actualizar en la colección users de Firestore
  await updateUserBannerURL(auth.currentUser.uid, bannerURL);

  return bannerURL;
}

export async function updateUserPhotoURL(uid, photoURL) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { photoURL });
}

export async function updateUserBannerURL(uid, bannerURL) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { bannerURL });
}

export async function updateDisplayName(newName) {
  const user = auth.currentUser;
  if (!user) throw new Error("There is no authenticated user.");

  await updateName(newName);

  // Actualizar los comentarios con el nuevo nombre
  await updateUserCommentsProfile(user.uid, user.photoURL, newName);

  return newName;
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Reset email sent. Check your inbox." };
  } catch (error) {
    let message = "An error occurred.";
    if (error.code === "auth/user-not-found") {
      message = "No user found with this email.";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address.";
    }

    return { success: false, message };
  }
}

export async function updateDataProfile(profileData) {
  if (!auth.currentUser) throw new Error("There is no authenticated user.");
  
  await updateUserProfile(auth.currentUser.uid, profileData);

  return { success: true, message: "Profile updated successfully." };
}