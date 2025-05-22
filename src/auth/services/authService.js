import { auth, storage} from "../../firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail 
} from "firebase/auth";
import { createUserProfile, createUserProfileIfNotExists, updateName} from "./userService";

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

  const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

  // Sube la imagen al Storage
  await uploadBytes(storageRef, file);

  // Obtiene la URL pública
  const photoURL = await getDownloadURL(storageRef);
  await updateProfile(auth.currentUser, { photoURL });

  return photoURL;
}

export async function updateDisplayName(newName) {
  await updateName(newName);

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
