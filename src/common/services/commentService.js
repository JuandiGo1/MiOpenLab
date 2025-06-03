import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { createNotification } from "../../notifications/services/notiservice";
import { getProjectById } from "../../profile/services/projectService";

export const createComment = async (projectId, userId, content) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const userRef = doc(db, "users", userId);
    
    const commentRef = await addDoc(collection(db, "comments"), {
      projectRef,
      userRef,
      userId,
      content,
      createdAt: serverTimestamp(),
      likes: [],
    });

    // Get user and project info for notification
    const [userDoc, project] = await Promise.all([
      getDoc(userRef),
      getProjectById(projectId)
    ]);
    const userData = userDoc.data();

    if (project && project.authorId !== userId) {
      await createNotification({
        to: project.authorId,
        from: userId,
        type: "comment",
        postId: projectId,
        postTitle: project.title,
        fromUsername: userData.displayName,
        fromPhoto: userData.photoURL,
        extraInfo: {
          commentContent: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
          commentId: commentRef.id
        }
      });
    }

    return commentRef.id;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const getProjectComments = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("projectRef", "==", projectRef),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      likes: doc.data().likes || []
    }));

    // Obtener la información de usuario para cada comentario
    const userPromises = comments.map(comment => 
      getDoc(comment.userRef).then(userDoc => ({
        ...comment,
        userDisplayName: userDoc.data().displayName,
        userPhotoURL: userDoc.data().photoURL
      }))
    );

    return Promise.all(userPromises);
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

export const deleteComment = async (commentId, projectId, userId) => {
  try {
    // Get project and comment info before deleting
    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);
    const project = await getProjectById(projectId);
    
    if (project && project.authorId !== userId && commentDoc.exists()) {
      // Notify project author about comment deletion
      await createNotification({
        to: project.authorId,
        from: userId,
        type: "comment_deleted",
        postId: projectId,
        postTitle: project.title,
        fromUsername: commentDoc.data().userDisplayName,
        fromPhoto: commentDoc.data().userPhotoURL,
        extraInfo: {
          commentContent: commentDoc.data().content.substring(0, 50) + 
                        (commentDoc.data().content.length > 50 ? "..." : "")
        }
      });
    }

    await deleteDoc(commentRef);  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const updateUserCommentsProfile = async (userId, newPhotoURL, newDisplayName) => {
  try {
    const commentsRef = collection(db, "comments");
    const userRef = doc(db, "users", userId);
    
    // Get all comments by the user
    const q = query(
      commentsRef,
      where("userRef", "==", userRef)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Batch update all comments
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        userPhotoURL: newPhotoURL,
        userDisplayName: newDisplayName
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error updating user comments profile:", error);
    throw error;
  }
};

export const getProjectCommentsCount = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("projectRef", "==", projectRef)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting comments count:", error);
    return 0;
  }
};

export const likeComment = async (commentId, userId, commentAuthorId) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    const userRef = doc(db, "users", userId);
    
    // Añadir el like al comentario
    await updateDoc(commentRef, {
      likes: arrayUnion(userId)
    });

    // Si no es el autor del comentario, enviar notificación
    if (userId !== commentAuthorId) {
      const commentDoc = await getDoc(commentRef);
      const userDoc = await getDoc(userRef);
      
      await createNotification({
        to: commentAuthorId,
        from: userId,
        type: "comment_like",
        postId: commentDoc.data().projectRef.id,
        fromUsername: userDoc.data().displayName,
        fromPhoto: userDoc.data().photoURL,
        extraInfo: {
          commentId: commentId,
          commentContent: commentDoc.data().content.substring(0, 50) + 
                        (commentDoc.data().content.length > 50 ? "..." : "")
        }
      });
    }
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};

export const unlikeComment = async (commentId, userId) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    
    await updateDoc(commentRef, {
      likes: arrayRemove(userId)
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    throw error;
  }
};
