import { db } from '../../firebase/Config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  limit,
  updateDoc,
  increment
} from 'firebase/firestore';

// Crear un nuevo tema de discusión en un grupo
export const createDiscussion = async (discussionData) => {
  const { groupId, ...rest } = discussionData;
  try {
    const collectionRef = collection(db, `groups/${groupId}/discussions`);
    const docRef = await addDoc(collectionRef, {
      ...rest,
      createdAt: serverTimestamp(),
      views: 0,
      replies: []
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
};

// Obtener todos los temas de discusión de un grupo
export const getGroupDiscussions = async (groupId) => {
  try {
    if (!groupId) return [];

    const collectionRef = collection(db, `groups/${groupId}/discussions`);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    // Obtener los temas de discusión y sus últimas respuestas en paralelo
    const discussionsPromises = snapshot.docs.map(async doc => {
      const discussionData = doc.data();
      const discussion = {
        id: doc.id,
        ...discussionData,
        createdAt: discussionData.createdAt?.toDate?.() || new Date(),
        replies: discussionData.replies || [],
        views: discussionData.views || 0
      };

      try {
        // Obtener la última respuesta para este tema de discusión
        const repliesRef = collection(db, `groups/${groupId}/discussions/${doc.id}/replies`);
        const repliesQuery = query(repliesRef, orderBy('createdAt', 'desc'), limit(1));
        const repliesSnapshot = await getDocs(repliesQuery);
        
        if (!repliesSnapshot.empty) {
          const lastReply = repliesSnapshot.docs[0].data();
          discussion.lastReply = {
            ...lastReply,
            createdAt: lastReply.createdAt?.toDate?.() || new Date()
          };
        }
      } catch (error) {
        console.error('Error fetching last reply:', error);
        // Continuar sin los datos de la última respuesta si hay un error
      }

      return discussion;
    });

    const discussions = await Promise.all(discussionsPromises);
    return discussions;
  } catch (error) {
    console.error('Error getting discussions:', error);
    return [];
  }
};

// Obtener un tema específico por ID dentro de un grupo
export const getDiscussionById = async (discussionId, groupId) => {
  try {
    if (!discussionId || !groupId) return null;

    const docRef = doc(db, `groups/${groupId}/discussions`, discussionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        replies: data.replies || [],
        views: data.views || 0
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting discussion:', error);
    throw error;
  }
};

// Obtener respuestas de un tema dentro de un grupo
export const getDiscussionReplies = async (discussionId, groupId) => {
  try {
    if (!discussionId || !groupId) return [];

    const collectionRef = collection(db, `groups/${groupId}/discussions/${discussionId}/replies`);
    const q = query(collectionRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error('Error getting replies:', error);
    return [];
  }
};

// Añadir una respuesta a un tema dentro de un grupo
export const addReply = async (discussionId, replyData) => {
  const { groupId, ...rest } = replyData;
  try {
    // Añadir la respuesta
    const collectionRef = collection(db, `groups/${groupId}/discussions/${discussionId}/replies`);
    const docRef = await addDoc(collectionRef, {
      ...rest,
      createdAt: serverTimestamp()
    });

    // Actualizar la última respuesta del tema de discusión
    const discussionRef = doc(db, `groups/${groupId}/discussions`, discussionId);
    const discussionDoc = await getDoc(discussionRef);
    if (discussionDoc.exists()) {
      const replies = (discussionDoc.data().replies || 0) + 1;
      await updateDoc(discussionRef, {
        replies,
        lastReply: {
          ...rest,
          createdAt: serverTimestamp()
        }
      });
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};
