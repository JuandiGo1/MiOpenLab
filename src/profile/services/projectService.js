import { db } from '../../firebase/Config'
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';


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
            likedBy: []
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
            likes: arrayRemove(userId)
        });

    } else {
        // Dar like
        await updateDoc(projectRef, {
            likes: arrayUnion(userId)
        });
    }
};
