import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  where,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase/Config';

// Crear un nuevo tema de discusión
export const createDiscussion = async (userId, { title, content, category }) => {
  try {
    const discussionRef = await addDoc(collection(db, 'discussions'), {
      title,
      content,
      category,
      authorId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      replies: 0,
      views: 0,
      lastReplyAt: null,
      lastReplyBy: null
    });
    return discussionRef.id;
  } catch (error) {
    console.error('Error creating discussion:', error);
    throw error;
  }
};

// Obtener todos los temas de discusión
export const getAllDiscussions = async () => {
  try {
    const q = query(
      collection(db, 'discussions'),
      orderBy('lastReplyAt', 'desc'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting discussions:', error);
    throw error;
  }
};

// Obtener un tema específico por ID
export const getDiscussionById = async (discussionId) => {
  try {
    const discussionRef = doc(db, 'discussions', discussionId);
    const discussionDoc = await getDoc(discussionRef);
    
    if (!discussionDoc.exists()) {
      throw new Error('Discussion not found');
    }
    
    // Incrementar vistas
    await updateDoc(discussionRef, {
      views: (discussionDoc.data().views || 0) + 1
    });

    return {
      id: discussionDoc.id,
      ...discussionDoc.data()
    };
  } catch (error) {
    console.error('Error getting discussion:', error);
    throw error;
  }
};

// Añadir una respuesta a un tema
export const addReply = async (discussionId, userId, content) => {
  try {
    const replyRef = await addDoc(collection(db, 'replies'), {
      discussionId,
      content,
      authorId: userId,
      createdAt: serverTimestamp()
    });

    // Actualizar el tema principal
    const discussionRef = doc(db, 'discussions', discussionId);
    await updateDoc(discussionRef, {
      replies: increment(1),
      lastReplyAt: serverTimestamp(),
      lastReplyBy: userId
    });

    return replyRef.id;
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

// Obtener respuestas de un tema
export const getDiscussionReplies = async (discussionId) => {
  try {
    const q = query(
      collection(db, 'replies'),
      where('discussionId', '==', discussionId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting replies:', error);
    throw error;
  }
};
