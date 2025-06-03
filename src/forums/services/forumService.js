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
  increment,
  startAfter
} from 'firebase/firestore';

const REPLIES_PER_PAGE = 10;
const MIN_DISCUSSION_LENGTH = 10;
const MAX_DISCUSSION_LENGTH = 2000;
const MIN_REPLY_LENGTH = 5;
const MAX_REPLY_LENGTH = 1000;

// Validación del contenido
const validateContent = (content, minLength, maxLength, type = 'content') => {
  if (!content || typeof content !== 'string') {
    throw new Error(`${type} is required and must be a string`);
  }
  if (content.trim().length < minLength) {
    throw new Error(`${type} must be at least ${minLength} characters long`);
  }
  if (content.trim().length > maxLength) {
    throw new Error(`${type} cannot exceed ${maxLength} characters`);
  }
  return content.trim();
};

// Crear un nuevo tema de discusión en un grupo
export const createDiscussion = async (discussionData) => {
  const { groupId, title, content, ...rest } = discussionData;
  try {
    if (!groupId) throw new Error('Group ID is required');
    
    // Validar título y contenido
    const validatedTitle = validateContent(title, 5, 100, 'Title');
    const validatedContent = validateContent(content, MIN_DISCUSSION_LENGTH, MAX_DISCUSSION_LENGTH, 'Content');

    const collectionRef = collection(db, `groups/${groupId}/discussions`);
    const docRef = await addDoc(collectionRef, {
      ...rest,
      title: validatedTitle,
      content: validatedContent,
      createdAt: serverTimestamp(),
      views: 0,
      replies: 0,
      lastActivity: serverTimestamp()
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

    const discussionRef = doc(db, `groups/${groupId}/discussions/${discussionId}`);
    const discussionDoc = await getDoc(discussionRef);
    
    if (!discussionDoc.exists()) return null;
    
    const data = discussionDoc.data();
    return {
      id: discussionDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date()
    };
  } catch (error) {
    console.error('Error getting discussion:', error);
    return null;
  }
};

// Obtener respuestas de un tema dentro de un grupo
export const getDiscussionReplies = async (discussionId, groupId, lastDoc = null) => {
  try {
    if (!discussionId || !groupId) return { replies: [], hasMore: false };

    const collectionRef = collection(db, `groups/${groupId}/discussions/${discussionId}/replies`);
    let q = query(collectionRef, orderBy('createdAt', 'asc'));

    if (lastDoc) {
      // Si existe un último documento, usar su snapshot para la paginación
      const lastDocRef = doc(db, `groups/${groupId}/discussions/${discussionId}/replies/${lastDoc.id}`);
      const lastDocSnap = await getDoc(lastDocRef);
      if (lastDocSnap.exists()) {
        q = query(q, startAfter(lastDocSnap));
      }
    }

    q = query(q, limit(10)); // Aplicar el límite después de otras condiciones

    const snapshot = await getDocs(q);
    const replies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));

    // Verificar si hay más resultados
    const hasMore = replies.length === 10;

    return {
      replies,
      hasMore,
      lastReply: replies[replies.length - 1]
    };
  } catch (error) {
    console.error('Error getting replies:', error);
    return { replies: [], hasMore: false };
  }
};

// Añadir una respuesta a un tema dentro de un grupo
export const addReply = async (discussionId, replyData) => {
  const { groupId, content, ...rest } = replyData;
  try {
    if (!discussionId || !groupId) {
      throw new Error('Discussion ID and Group ID are required');
    }

    // Validar contenido de la respuesta
    const validatedContent = validateContent(content, MIN_REPLY_LENGTH, MAX_REPLY_LENGTH, 'Reply');

    // Verificar que la discusión existe
    const discussionRef = doc(db, `groups/${groupId}/discussions`, discussionId);
    const discussionDoc = await getDoc(discussionRef);
    
    if (!discussionDoc.exists()) {
      throw new Error('Discussion not found');
    }

    // Añadir la respuesta
    const collectionRef = collection(db, `groups/${groupId}/discussions/${discussionId}/replies`);
    const docRef = await addDoc(collectionRef, {
      ...rest,
      content: validatedContent,
      createdAt: serverTimestamp()
    });

    // Actualizar la última respuesta y contador de respuestas
    await updateDoc(discussionRef, {
      replies: increment(1),
      lastReply: {
        ...rest,
        content: validatedContent,
        createdAt: serverTimestamp()
      },
      lastActivity: serverTimestamp()
    });

    // Retornar la respuesta con optimistic data
    return {
      id: docRef.id,
      ...rest,
      content: validatedContent,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};
