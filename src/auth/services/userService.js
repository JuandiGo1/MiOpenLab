import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase/Config";

// Valida username único
export async function isUsernameAvailable(username) {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

export async function generateUniqueUsername(displayName) {
  let baseUsername = displayName.replace(/\s+/g, "").toLowerCase();
  let username = baseUsername;
  let counter = 0;

  while (true) {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No existe, está disponible
      return username;
    }

    // Si ya existe, probar con número
    counter++;
    username = `${baseUsername}${counter}`;
  }
}

export async function createUserProfile({ uid, displayName, photoURL }) {
  const userDoc = doc(db, "users", uid);
  const username = await generateUniqueUsername(displayName);

  await setDoc(userDoc, {
    username,
    displayName,
    photoURL,
    bio: "",
    likes: [],
    followers: [],
    following: [],
    createdAt: new Date(),
  });
}

export async function createUserProfileIfNotExists({
  uid,
  displayName,
  photoURL,
}) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const username = await generateUniqueUsername(displayName);
    await setDoc(userRef, {
      displayName,
      username,
      photoURL,
      createdAt: Date.now(),
      followers: [],
      following: [],
      likedProjects: [],
    });

    console.log("Usuario creao");
  }
}

export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function likePost(uid, postId) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    likedProjects: arrayUnion(postId),
  });
}

export async function unlikePost(uid, postId) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    likedProjects: arrayRemove(postId),
  });
}

export async function followUser(currentUid, targetUid) {
  const currentRef = doc(db, "users", currentUid);
  const targetRef = doc(db, "users", targetUid);

  await updateDoc(currentRef, {
    following: arrayUnion(targetUid),
  });

  await updateDoc(targetRef, {
    followers: arrayUnion(currentUid),
  });
}

export async function unfollowUser(currentUid, targetUid) {
  const currentRef = doc(db, "users", currentUid);
  const targetRef = doc(db, "users", targetUid);

  await updateDoc(currentRef, {
    following: arrayRemove(targetUid),
  });

  await updateDoc(targetRef, {
    followers: arrayRemove(currentUid),
  });
}
