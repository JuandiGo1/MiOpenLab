import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from '../../firebase/Config';

// Crear un nuevo grupo
export const createGroup = async (userId, { name, description }) => {
  try {
    const groupRef = await addDoc(collection(db, 'groups'), {
      name,
      description,
      creatorId: userId,
      members: [userId],
      memberCount: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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

// Verificar si un usuario es miembro de un grupo
export const isGroupMember = async (groupId, userId) => {
  try {
    const group = await getGroupById(groupId);
    return group?.members?.includes(userId) || false;
  } catch (error) {
    console.error('Error checking group membership:', error);
    return false;
  }
};

// Obtener todos los grupos
export const getAllGroups = async () => {
  try {
    const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
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
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    if (groupData.members.includes(userId)) {
      throw new Error('Already a member');
    }

    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      memberCount: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

// Dejar un grupo
export const leaveGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    if (!groupData.members.includes(userId)) {
      throw new Error('Not a member');
    }

    if (groupData.creatorId === userId) {
      throw new Error('Creator cannot leave group');
    }

    await updateDoc(groupRef, {
      members: arrayRemove(userId),
      memberCount: increment(-1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

// Eliminar un grupo
export const deleteGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    if (groupData.creatorId !== userId) {
      throw new Error('Only creator can delete group');
    }

    await deleteDoc(groupRef);
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};
