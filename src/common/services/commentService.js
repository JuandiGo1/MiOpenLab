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
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { createNotification } from "../../notifications/services/notiservice";
import { getProjectById } from "../../profile/services/projectService";

export const createComment = async (projectId, userId, content, userDisplayName, userPhotoURL) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const userRef = doc(db, "users", userId);
    
    const commentRef = await addDoc(collection(db, "comments"), {
      projectRef, // Reference to the project document
      userRef,    // Reference to the user document
      content,
      userDisplayName, // We keep these for quick access without additional queries
      userPhotoURL,   // We keep these for quick access without additional queries
      createdAt: serverTimestamp(),
    });

    // Get project author info to send notification
    const project = await getProjectById(projectId);
    if (project && project.authorId !== userId) {      await createNotification({
        to: project.authorId,
        from: userId,
        type: "comment",
        postId: projectId,
        postTitle: project.title,
        fromUsername: userDisplayName,
        fromPhoto: userPhotoURL,
        extraInfo: {
          commentContent: content.substring(0, 50) + (content.length > 50 ? "..." : ""), // First 50 chars of comment
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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

    await deleteDoc(commentRef);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
