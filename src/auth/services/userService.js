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
import { auth, db } from "../../firebase/Config";
import { createNotification } from "../../notifications/services/notiservice";
import { getProjectById } from "../../profile/services/projectService";

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

export async function getUserProfileByUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { uid: userDoc.id, ...userDoc.data() };
  } else {
    return null;
  }
}

export async function getUserLikes(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().likedProjects;
  } else {
    return null;
  }
}

export async function likePost(uid, postId) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("El usuario no existe.");
  }

  const userData = userSnap.data();

  await updateDoc(userRef, {
    likedProjects: arrayUnion(postId),
  });
  const postRef = await getProjectById(postId);
  // Mandar noti
  if(postRef.authorId == uid) return; // No notificar si se da like a si mismoo
  console.log("Mandando noti desde " + userData.username);
  
  await createNotification({
    to: postRef.authorId,
    from: uid,
    type: "like",
    postId: postId,
    postTitle: postRef.title,
    fromUsername: userData.username,
    fromPhoto: userData.photoURL,
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
  const userSnap = await getDoc(currentRef);

  if (!userSnap.exists()) {
    throw new Error("El usuario no existe.");
  }

  const userData = userSnap.data();

  await updateDoc(currentRef, {
    following: arrayUnion(targetUid),
  });

  await updateDoc(targetRef, {
    followers: arrayUnion(currentUid),
  });

  await createNotification({
    to: targetUid,
    from: currentUid,
    type: "follow",
    fromUsername: userData.username,
    fromPhoto: userData.photoURL,
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

export async function getUserFollowers(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().followers || []; // Retornar un array vacío si no hay seguidores
  } else {
    return [];
  }
}

export async function getUserFollowing(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().following || []; // Retornar un array vacío si no sigue a nadie
  } else {
    return [];
  }
}

export async function getUsernameById(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().username;
  } else {
    return null;
  }
}

export async function updateName(newName) {
  const user = auth.currentUser;
  if (!user) throw new Error("There is no authenticated user.");
  if (!newName) throw new Error("Username cannot be empty or only spaces!");
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    displayName: newName,
  });
}
