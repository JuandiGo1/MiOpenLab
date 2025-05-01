import { db } from "../../firebase/Config";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const getUserProjects = async (userId) => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("authorId", "==", userId));
    const querySnapshot = await getDocs(q);

    const userProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return userProjects;
  } catch (e) {
    console.error("Error al obtener los proyectos del usuario:", e);
    return [];
  }
};

// Función para obtener todos los proyectos en general
export const getAllProjects = async () => {
  try {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);

    const allProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allProjects;
  } catch (e) {
    console.error("Error al obtener todos los proyectos:", e);
    return [];
  }
};

export async function createProject(projectData, currentUser) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      title: projectData.title,
      description: projectData.description,
      linkRepo: projectData.linkRepo,
      linkDemo: projectData.linkDemo,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
    });

    console.log("Proyecto creado con ID:", docRef.id);
  } catch (e) {
    console.error("Error al crear el proyecto:", e);
  }
}

export const editProject = async (projectId, newData) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, newData); // newData: { title, description, ... }
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
};

export const toggleLike = async (projectId, userId, isLiked) => {
  const projectRef = doc(db, "projects", projectId);

  if (isLiked) {
    // Quitar like
    await updateDoc(projectRef, {
      likes: arrayRemove(userId),
    });
  } else {
    // Dar like
    await updateDoc(projectRef, {
      likes: arrayUnion(userId),
    });
  }
};
