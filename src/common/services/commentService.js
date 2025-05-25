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
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { createNotification } from "../../notifications/services/notiservice";
import { getProjectById } from "../../profile/services/projectService";

export const createComment = async (projectId, userId, content, userDisplayName, userPhotoURL) => {
  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      projectId,
      userId,
      content,
      userDisplayName,
      userPhotoURL,
      createdAt: serverTimestamp(),
    });

    // Get project author info to send notification
    const project = await getProjectById(projectId);
    if (project && project.authorId !== userId) {
      await createNotification({
        to: project.authorId,
        from: userId,
        type: "comment",
        postId: projectId,
        postTitle: project.title,
        fromUsername: userDisplayName,
        fromPhoto: userPhotoURL,
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
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("projectId", "==", projectId),
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

export const deleteComment = async (commentId) => {
  try {
    await deleteDoc(doc(db, "comments", commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
