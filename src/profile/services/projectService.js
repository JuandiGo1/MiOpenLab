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
  getDoc,
  query,
  where,
  increment,
} from "firebase/firestore";

export async function createProject(projectData, currentUser) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      title: projectData.title,
      titleLowerCase: projectData.title.toLowerCase(),
      description: projectData.description,
      linkRepo: projectData.linkRepo,
      linkDemo: projectData.linkDemo,
      authorId: currentUser.uid,
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

export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId); // Referencia al documento por ID
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() };
    } else {
      console.error("No se encontró el proyecto con el ID proporcionado.");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener proyecto:", e);
    return null;
  }
};

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
    const sortedProjects = [...allProjects].sort((a, b) => {
      const dateA = a.createdAt.seconds;
      const dateB = b.createdAt.seconds;

      return dateB - dateA;
    });

    return sortedProjects;
  } catch (e) {
    console.error("Error al obtener todos los proyectos:", e);
    return [];
  }
};

export const getTopProjects = async (nTop) => {
  try {
    const projects = await getAllProjects();
    const sortedProjects = projects.sort((a, b) => b.likes - a.likes); // Ordenar por likes de mayor a menor
    const topProjects = sortedProjects.slice(0, nTop);
    return topProjects;
  } catch (error) {
    console.error("Error al obtener todos los proyectos:", error);
    return [];
  }
};

export const searchProjects = async (searchTerm) => {
  try {
    const projectsRef = collection(db, "projects");
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const q = query(
      projectsRef,
      where("titleLowerCase", ">=", lowerCaseSearchTerm),
      where("titleLowerCase", "<=", lowerCaseSearchTerm + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);

    const searchedProjects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return searchedProjects;
  } catch (e) {
    throw new Error("Error searching projects:", e);
  }
};

export const editProject = async (projectId, newData) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, newData); // newData: { title, description, ... }
};

export const deleteProject = async (projectId) => {
  const projectRef = doc(db, "projects", projectId);
  try {
    // Obtener el documento del proyecto para acceder a su array 'likedBy'
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const projectData = projectSnap.data();
      const usersWhoLiked = projectData.likedBy || []; // Array de UIDs de usuarios

      // Para cada usuario que dio like, eliminar el projectId de su array 'likedProjects'
      const updateUserPromises = usersWhoLiked.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        try {
          await updateDoc(userRef, {
            likedProjects: arrayRemove(projectId)
          });
          console.log(`Proyecto ${projectId} eliminado de los likes del usuario ${userId}`);
        } catch (userUpdateError) {
          // Considera cómo manejar errores aquí. Por ahora, solo log.
          console.error(`Error al actualizar los likes del usuario ${userId} para el proyecto ${projectId}:`, userUpdateError);
        }
      });

      // Esperar a que todas las actualizaciones de usuarios se completen
      await Promise.all(updateUserPromises);

      // Finalmente, eliminar el documento del proyecto
      await deleteDoc(projectRef);
      console.log(`Proyecto ${projectId} y sus referencias de likes eliminados exitosamente.`);

    } else {
      console.error(`El proyecto ${projectId} no fue encontrado para eliminar.`);
      // Puedes lanzar un error aquí si es necesario
    }
  } catch (error) {
    console.error(`Error al eliminar el proyecto ${projectId}:`, error);
    throw error; // Re-lanzar el error para que el llamador lo maneje
  }
};

export const addLike = async (projectId, userId) => {
  const projectRef = doc(db, "projects", projectId);

  try {
    // Incrementar el contador de likes y agregar el usuario al array
    await updateDoc(projectRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
    console.log(
      `Like agregado al proyecto ${projectId} por el usuario ${userId}`
    );
  } catch (error) {
    console.error("Error al agregar like:", error);
  }
};

export const removeLike = async (projectId, userId) => {
  const projectRef = doc(db, "projects", projectId);

  try {
    // Decrementar el contador de likes y eliminar el usuario del array likedBy
    await updateDoc(projectRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
    console.log(
      `Like eliminado del proyecto ${projectId} por el usuario ${userId}`
    );
  } catch (error) {
    console.error("Error al eliminar like:", error);
  }
};
