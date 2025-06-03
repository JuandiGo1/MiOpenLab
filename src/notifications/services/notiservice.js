import {
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/Config";

export async function createNotification({
  to,
  from,
  type,
  postId = null,
  postTitle = null,
  fromUsername = null,
  fromPhoto = null,
}) {
  await addDoc(collection(db, "notifications"), {
    to,
    from,
    type,
    postId,
    createdAt: serverTimestamp(),
    read: false,
    postTitle,
    fromUsername,
    fromPhoto,
  });
}

export async function getUserNotifications(uid) {
  const q = query(
    collection(db, "notifications"),
    where("to", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function markNotificationAsRead(notificationId) {
  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

export const markAllAsRead = async (uid) => {
  try {
    // Obtener todas las notificaciones del usuario que no están leídas
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("to", "==", uid),
      where("read", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
    console.log(
      `Todas las notificaciones del usuario ${uid} han sido marcadas como leídas.`
    );
  } catch (error) {
    console.error(
      "Error al marcar todas las notificaciones como leídas:",
      error
    );
  }
};

export const getUnreadNotificationsCount = async (uid) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("to", "==", uid),
      where("read", "==", false)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size; 
  } catch (error) {
    console.error("Error al obtener el conteo de notificaciones no leídas:", error);
    return 0;
  }
};



