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
  increment,
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
    bannerURL: "", // URL de la imagen de banner
    bio: "",
    headline: "", // Titular
    skills: [], // Lista de aptitudes
    badges: [], // Lista de insignias
    location: "", // Ubicación
    linkedin: "", // Perfil LinkedIn
    github: "", // Perfil GitHub
    likes: [],
    followers: [],
    following: [],
    favorites: [], // Lista de proyectos favoritos
    createdAt: new Date(),
    reputation: 0,          // Reputación inicial
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
      bannerURL: "",
      bio: "",
      headline: "",
      skills: [],
      badges: [],
      location: "",
      linkedin: "",
      github: "",
      createdAt: Date.now(),
      followers: [],
      following: [],
      likedProjects: [],
      favorites: [],      // Lista de proyectos favoritos
      reputation: 0,     // Reputación inicial
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
  if (!userSnap.exists()) throw new Error("El usuario no existe.");
  const userData = userSnap.data();

  // 1. Actualizar usuario (likedProjects)
  await updateDoc(userRef, { likedProjects: arrayUnion(postId) });

  // 2. Actualizar proyecto (likes y likedBy)
  const projectRef = doc(db, "projects", postId);
  await updateDoc(projectRef, {
    likes: increment(1),
    likedBy: arrayUnion(uid),
  });

  // 3. Reputación y notificación
  const postRef = await getProjectById(postId);

  if (postRef.authorId === uid) return; // No sumar si es el mismo usuario
  const authorRef = doc(db, "users", postRef.authorId);
  await updateDoc(authorRef, { reputation: increment(1) });
  await updateUserBadges(postRef.authorId);


  await createNotification({
    to: postRef.authorId,
    from: uid,
    type: "like",
    postId: postId,
    postTitle: postRef.title,
    fromUsername: userData.username,
    fromPhoto: userData.photoURL,
  });

  await addUserHistory(uid, {
    type: "like",
    postId: postId,
    postTitle: postRef.title,
    timestamp: Date.now(),
  });
}

export async function unlikePost(uid, postId) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { likedProjects: arrayRemove(postId) });

  // 2. Actualizar proyecto (likes y likedBy)
  const projectRef = doc(db, "projects", postId);
  await updateDoc(projectRef, {
    likes: increment(-1),
    likedBy: arrayRemove(uid),
  });

  // 3. Reputación
  const postRef = await getProjectById(postId);
  if (postRef && postRef.authorId && postRef.authorId !== uid) {
    const authorRef = doc(db, "users", postRef.authorId);
    await updateDoc(authorRef, { reputation: increment(-1) });
    await updateUserBadges(postRef.authorId);
  }
}

export async function followUser(currentUid, targetUid) {
  const currentRef = doc(db, "users", currentUid);
  const targetRef = doc(db, "users", targetUid);
  const targetSnap = await getDoc(targetRef);
  const targetData = targetSnap.data();
  const targetUsername = targetData.username;
  const userSnap = await getDoc(currentRef);

  if (!userSnap.exists()) {
    throw new Error("El usuario no existe.");
  }

  const userData = userSnap.data();



  await Promise.all([
    updateDoc(currentRef, {
      following: arrayUnion(targetUid),
    }),
    updateDoc(targetRef, {
      followers: arrayUnion(currentUid),
    }),
    createNotification({
      to: targetUid,
      from: currentUid,
      type: "follow",
      fromUsername: userData.username,
      fromPhoto: userData.photoURL,
    }),
  ]);

  await updateUserBadges(targetUid);
  
  await addUserHistory(currentUid, {
    type: "follow",
    targetUsername: targetUsername,
    toUid: targetUid,
    timestamp: Date.now(),
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
    reputation: increment(-5),
  });
  await updateUserBadges(targetUid);
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

export async function updateUserProfile(uid, data) {
  if (!uid) throw new Error("User ID is required for updating profile.");
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

export async function ensureUserFields(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const missingFields = {};

  if (data.bannerURL === undefined) missingFields.bannerURL = "";
  if (data.bio === undefined) missingFields.bio = "";
  if (data.headline === undefined) missingFields.headline = "";
  if (data.skills === undefined) missingFields.skills = [];
  if (data.badges === undefined) missingFields.badges = [];
  if (data.location === undefined) missingFields.location = "";
  if (data.linkedin === undefined) missingFields.linkedin = "";
  if (data.github === undefined) missingFields.github = "";
  if (data.reputation === undefined) missingFields.reputation = 0;

  if (Object.keys(missingFields).length > 0) {
    await updateDoc(userRef, missingFields);
  }
}

// Añadir proyecto a favoritos
export async function addToFavorites(userId, projectId) {
  try {
    const userRef = doc(db, "users", userId);

    // Añadir a favoritos
    await updateDoc(userRef, {
      favorites: arrayUnion(projectId),
    });

    // Obtener info del proyecto para la notificación
    const project = await getProjectById(projectId);
    if (project && project.authorId !== userId) {
      await createNotification({
        to: project.authorId,
        from: userId,
        type: "favorite",
        postId: projectId,
        postTitle: project.title,
      });
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
}

// Eliminar proyecto de favoritos
export async function removeFromFavorites(userId, projectId) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(projectId),
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
}

// Obtener proyectos favoritos de un usuario
export async function getUserFavorites(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return [];
    }

    const favorites = userDoc.data().favorites || [];
    const projects = [];

    // Obtener los detalles de cada proyecto favorito
    for (const projectId of favorites) {
      const project = await getProjectById(projectId);
      if (project) {
        projects.push(project);
      }
    }

    return projects;
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
}


// Sumar reputación extra cuando un proyecto es destacado
export async function addFeaturedReputation(userId, points = 20) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { reputation: increment(points) });
  await updateUserBadges(userId);
}

// Niveles de reputación y badges automáticos
const BADGE_LEVELS = [
  { min: 100, badge: "legend" },
  { min: 50, badge: "master" },
  { min: 25, badge: "pro" },
  { min: 10, badge: "advanced" },
  { min: 5, badge: "intermediate" },
  { min: 1, badge: "beginner" },
];

export async function updateUserBadges(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const user = userSnap.data();
  const rep = user.reputation || 0;
  let badges = user.badges || [];

  // Determinar el badge más alto alcanzado
  let newBadge = null;
  for (const level of BADGE_LEVELS) {
    if (rep >= level.min) {
      newBadge = level.badge;
      break;
    }
  }

  // Quitar todas las badges de nivel y dejar solo la nueva (si existe)
  const otherBadges = badges.filter(
    b => !BADGE_LEVELS.map(l => l.badge).includes(b)
  );
  if (newBadge) {
    badges = [newBadge, ...otherBadges];
  } else {
    badges = [...otherBadges];
  }
  await updateDoc(userRef, { badges });
}

export const getUserActivity = async (uid) => {
  if (!uid) throw new Error("User ID is required");
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) throw new Error("User not found");

  let userData = userSnap.data();
  if (!Array.isArray(userData.history)) {
    // Si no existe el campo history, lo crea como array vacío
    await updateDoc(userRef, { history: [] });
    return [];
  }
  return userData.history;
};

async function addUserHistory(uid, entry) {
  if (!uid) throw new Error("User ID is required");
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    history: arrayUnion(entry),
  });
}

