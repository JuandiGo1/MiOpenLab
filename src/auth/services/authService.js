import { auth, storage} from "../../firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();


export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export async function registerUser(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return { success: false, message: "The email is already in use. Please use another one." };
    } else if (error.code === "auth/invalid-email") {
      return { success: false, message: "The email is invalid. Please check the format." };
    } else if (error.code === "auth/weak-password") {
      return { success: false, message: "The password is too weak. Use at least 6 characters." };
    } else {
      return { success: false, message: "An unknown error occurred. Please try again." };
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
    return { success: true, user: userCredential.user };
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
      return { success: false, message: "An unknown error occurred. Please try again." };
    }
  }
}

export async function logoutUser() {
  await signOut(auth);
}


export async function uploadProfilePicture(file) {
  if (!auth.currentUser) throw new Error("No hay usuario autenticado.");

  const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);

  // Sube la imagen al Storage
  await uploadBytes(storageRef, file);

  // Obtiene la URL pública
  const photoURL = await getDownloadURL(storageRef);
  await updateProfile(auth.currentUser, { photoURL });

  return photoURL;
}