import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/Config';
import { createNotification } from '../../notifications/services/notiservice';

// Crear un nuevo grupo (solo admin)
export const createGroup = async (groupData) => {
  try {
    const groupRef = await addDoc(collection(db, 'groups'), {
      ...groupData,
      memberCount: 0,
      createdAt: serverTimestamp(),
    });
    return groupRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Obtener un grupo por ID
export const getGroupById = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) return null;
    return { id: groupDoc.id, ...groupDoc.data() };
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

// Obtener todos los grupos
export const getAllGroups = async () => {
  try {
    const q = query(collection(db, 'groups'), orderBy('memberCount', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting groups:', error);
    throw error;
  }
};

// Unirse a un grupo
export const joinGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const userRef = doc(db, 'users', userId);

    // Actualizar el grupo
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      memberCount: increment(1)
    });

    // Actualizar el usuario
    await updateDoc(userRef, {
      groups: arrayUnion(groupId)
    });

    // Obtener información del grupo para la notificación
    const groupDoc = await getDoc(groupRef);
    const groupData = groupDoc.data();

    // Notificar a los administradores del grupo
    if (groupData.adminIds?.length > 0) {
      await Promise.all(groupData.adminIds.map(adminId =>
        createNotification({
          to: adminId,
          from: userId,
          type: 'group_join',
          groupId,
          groupName: groupData.name
        })
      ));
    }
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

// Dejar un grupo
export const leaveGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const userRef = doc(db, 'users', userId);

    await updateDoc(groupRef, {
      members: arrayRemove(userId),
      memberCount: increment(-1)
    });

    await updateDoc(userRef, {
      groups: arrayRemove(groupId)
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

// Verificar si un usuario es miembro de un grupo
export const isGroupMember = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) return false;
    
    const groupData = groupDoc.data();
    return groupData.members?.includes(userId) || false;
  } catch (error) {
    console.error('Error checking group membership:', error);
    throw error;
  }
};

// Buscar grupos por nombre o tecnología
export const searchGroups = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'groups'),
      where('searchTerms', 'array-contains', searchTerm.toLowerCase()),
      orderBy('memberCount', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching groups:', error);
    throw error;
  }
};

// Obtener grupos populares
export const getPopularGroups = async (limit = 5) => {
  try {
    const q = query(
      collection(db, 'groups'),
      orderBy('memberCount', 'desc'),
      limit
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting popular groups:', error);
    throw error;
  }
};
