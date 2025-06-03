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
  increment,
  writeBatch
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
      projects: [],
      banner: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
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
    
    const groupData = groupDoc.data();

    // Obtener datos del creador
    const creatorDoc = await getDoc(doc(db, 'users', groupData.creatorId));
    const creatorData = creatorDoc.exists() ? creatorDoc.data() : null;

    // Obtener detalles de los miembros en paralelo
    const memberDetails = await Promise.all(
      (groupData.members || []).map(async (memberId) => {
        try {
          const memberDoc = await getDoc(doc(db, 'users', memberId));
          if (!memberDoc.exists()) return null;
          const memberData = memberDoc.data();
          return {
            id: memberId,
            displayName: memberData.displayName || 'Usuario',
            photoURL: memberData.photoURL || '/default-avatar.png',
            username: memberData.username
          };
        } catch (error) {
          console.error(`Error fetching member ${memberId}:`, error);
          return null;
        }
      })
    );

    const validMemberDetails = memberDetails.filter(Boolean);

    return {
      id: groupDoc.id,
      ...groupData,
      creator: creatorData ? {
        id: groupData.creatorId,
        displayName: creatorData.displayName || 'Usuario',
        photoURL: creatorData.photoURL || '/default-avatar.png',
        username: creatorData.username
      } : null,
      memberDetails: validMemberDetails,
      memberCount: groupData.members.length // Calculado desde el array de members
    };
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

// Verificar si un usuario es miembro de un grupo
export const isGroupMember = async (groupId, userId) => {
  try {
    const group = await getGroupById(groupId);
    // group.members is an array of objects {id, displayName, photoURL}
    return group?.members?.some(member => member.id === userId) || false;
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
    
    const groupsWithData = await Promise.all(querySnapshot.docs.map(async (groupDoc) => {
      const groupData = groupDoc.data();
      
      if (!groupData?.creatorId) {
        console.error('Group missing creatorId:', groupDoc.id);
        return null;
      }

      // Obtener datos del creador
      const creatorDoc = await getDoc(doc(db, 'users', groupData.creatorId));
      if (!creatorDoc.exists()) {
        console.error('Creator not found:', groupData.creatorId);
        return null;
      }
      const creatorData = creatorDoc.data();

      return {
        id: groupDoc.id,
        ...groupData,
        creator: {
          id: creatorDoc.id,
          displayName: creatorData?.displayName || 'Unknown',
          photoURL: creatorData?.photoURL || '',
        },
        // members se mantiene como array de IDs
        memberCount: groupData.members?.length || 0
      };
    }));

    return groupsWithData.filter(Boolean);
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
    
    // Verificar que el usuario no es ya miembro
    if (groupData.members.includes(userId)) {
      throw new Error('Already a member');
    }

    // Actualizar el documento
    const members = [...groupData.members, userId];
    await updateDoc(groupRef, {
      members,  // Nuevo array con el usuario añadido
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

    // Actualizar el documento
    const members = groupData.members.filter(id => id !== userId);
    await updateDoc(groupRef, {
      members,  // Nuevo array sin el usuario
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
    const userRef = doc(db, 'users', userId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }    const groupData = groupDoc.data();
    if (groupData.creatorId !== userId) {
      throw new Error('Only creator can delete group');
    }

    // Delete the group
    const batch = writeBatch(db);
    batch.delete(groupRef);

    await Promise.all(memberUpdates);
    await batch.commit();
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// Añadir proyecto al grupo
export const addProjectToGroup = async (groupId, projectId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const projectRef = doc(db, 'projects', projectId);

    const [groupDoc, projectDoc] = await Promise.all([
      getDoc(groupRef),
      getDoc(projectRef)
    ]);

    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const groupData = groupDoc.data();
    // Verificar que el usuario es miembro del grupo
    if (!groupData.members.includes(userId)) {
      throw new Error('Must be a member to add projects');
    }
    // Verificar que el proyecto pertenece al usuario
    if (projectDoc.data().authorId !== userId) {
      throw new Error('Can only add your own projects');
    }
    // Verificar que el proyecto no está ya en el grupo
    if (groupData.projects.includes(projectId)) {
      throw new Error('Project already in group');
    }

    const batch = writeBatch(db);
    // Añadir proyecto al grupo (por ID)
    batch.update(groupRef, {
      projects: arrayUnion(projectId),
      updatedAt: serverTimestamp()
    });
    // Añadir grupo al proyecto (por ID)
    batch.update(projectRef, {
      groups: arrayUnion(groupId)
    });
    await batch.commit();
  } catch (error) {
    console.error('Error adding project to group:', error);
    throw error;
  }
};

// Eliminar proyecto del grupo
export const removeProjectFromGroup = async (groupId, projectId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const projectRef = doc(db, 'projects', projectId);

    const [groupDoc, projectDoc] = await Promise.all([
      getDoc(groupRef),
      getDoc(projectRef)
    ]);

    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    if (!projectDoc.exists()) {
      throw new Error('Project not found');
    }

    const groupData = groupDoc.data();
    // Verificar que el usuario es el creador del grupo o el dueño del proyecto
    if (groupData.creatorId !== userId && projectDoc.data().authorId !== userId) {
      throw new Error('Only group creator or project owner can remove projects');
    }

    const batch = writeBatch(db);
    // Quitar proyecto del grupo (por ID)
    batch.update(groupRef, {
      projects: arrayRemove(projectId),
      updatedAt: serverTimestamp()
    });
    // Quitar grupo del proyecto (por ID)
    batch.update(projectRef, {
      groups: arrayRemove(groupId)
    });
    await batch.commit();
  } catch (error) {
    console.error('Error removing project from group:', error);
    throw error;
  }
};

// Obtener proyectos de un grupo
export const getGroupProjects = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }
    const groupData = groupDoc.data();
    if (!groupData.projects.length) {
      return [];
    }
    // Obtener los datos completos de cada proyecto (por ID)
    const projects = await Promise.all(
      groupData.projects.map(async (projectId) => {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (!projectDoc.exists()) return null;
        const projectData = projectDoc.data();
        const authorDoc = await getDoc(doc(db, 'users', projectData.authorId));
        const authorData = authorDoc.data();
        return {
          id: projectDoc.id,
          ...projectData,
          author: {
            id: authorDoc.id,
            displayName: authorData.displayName,
            photoURL: authorData.photoURL
          }
        };
      })
    );
    // Filtrar cualquier proyecto que haya sido eliminado
    return projects.filter(Boolean);
  } catch (error) {
    console.error('Error getting group projects:', error);
    throw error;
  }
};
