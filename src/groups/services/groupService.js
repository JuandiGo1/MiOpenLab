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
    // Obtener información del creador
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();    // Crear referencia al usuario
    const creatorRef = doc(db, 'users', userId);    const groupRef = await addDoc(collection(db, 'groups'), {
      name,
      description,
      creator: creatorRef,        // Referencia al documento del creador
      members: [creatorRef],      // Array de referencias a documentos de usuarios
      memberCount: 1,
      projects: [],              // Array de referencias a documentos de proyectos
      projectCount: 0,
      banner: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Actualizar el usuario con el grupo creado
    await updateDoc(userRef, {
      groups: arrayUnion(groupRef.id)
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
    const creatorDoc = await getDoc(groupData.creator);
    const creatorData = creatorDoc.data();

    // Resolver datos del creador y miembros
    const members = await Promise.all(
      groupData.members.map(async (memberRef) => {
        const memberDoc = await getDoc(memberRef);
        const memberData = memberDoc.data();
        return {
          id: memberDoc.id,
          displayName: memberData.displayName,
          photoURL: memberData.photoURL
        };
      })
    );

    return {
      id: groupDoc.id,
      ...groupData,
      creator: {
        id: creatorDoc.id,
        displayName: creatorData.displayName,
        photoURL: creatorData.photoURL
      },
      members
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
    const userRef = doc(db, 'users', userId);
    return group?.members?.some(memberRef => memberRef.path === userRef.path) || false;
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
    
    // Obtener los grupos con los datos del creador resueltos
    const groupsWithData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const groupData = doc.data();
      const creatorDoc = await getDoc(groupData.creator);
      const creatorData = creatorDoc.data();

      return {
        id: doc.id,
        ...groupData,
        creator: {
          id: creatorDoc.id,
          displayName: creatorData.displayName,
          photoURL: creatorData.photoURL,
        },
        members: groupData.members.map(memberRef => memberRef.path)
      };
    }));

    return groupsWithData;
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
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    const memberRefs = groupData.members.map(memberRef => memberRef.path);
    if (memberRefs.includes(userRef.path)) {
      throw new Error('Already a member');
    }

    await updateDoc(groupRef, {
      members: arrayUnion(userRef),
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
    const userRef = doc(db, 'users', userId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    const memberRefs = groupData.members.map(memberRef => memberRef.path);
    if (!memberRefs.includes(userRef.path)) {
      throw new Error('Not a member');
    }

    if (groupData.creator.path === userRef.path) {
      throw new Error('Creator cannot leave group');
    }

    await updateDoc(groupRef, {
      members: arrayRemove(userRef),
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
    const userRef = doc(db, 'users', userId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupDoc.data();
    if (groupData.creator.path !== userRef.path) {
      throw new Error('Only creator can delete group');
    }

    // Eliminar el grupo y actualizar referencias en los usuarios
    const batch = writeBatch(db);
    
    // Eliminar el grupo
    batch.delete(groupRef);
    
    // Actualizar los usuarios que son miembros
    const memberUpdates = groupData.members.map(async (memberRef) => {
      batch.update(memberRef, {
        groups: arrayRemove(groupRef.id)
      });
    });

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
    const userRef = doc(db, 'users', userId);

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
    const memberRefs = groupData.members.map(memberRef => memberRef.path);
    
    // Verificar que el usuario es miembro del grupo
    if (!memberRefs.includes(userRef.path)) {
      throw new Error('Must be a member to add projects');
    }

    // Verificar que el proyecto pertenece al usuario
    if (projectDoc.data().authorId !== userId) {
      throw new Error('Can only add your own projects');
    }

    // Verificar que el proyecto no está ya en el grupo
    if (groupData.projects.includes(projectRef.id)) {
      throw new Error('Project already in group');
    }

    const batch = writeBatch(db);

    // Añadir proyecto al grupo
    batch.update(groupRef, {
      projects: arrayUnion(projectRef),
      projectCount: increment(1),
      updatedAt: serverTimestamp()
    });

    // Añadir referencia del grupo al proyecto
    batch.update(projectRef, {
      groups: arrayUnion(groupRef)
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
    const userRef = doc(db, 'users', userId);

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
    if (groupData.creator.path !== userRef.path && projectDoc.data().authorId !== userId) {
      throw new Error('Only group creator or project owner can remove projects');
    }

    const batch = writeBatch(db);

    // Quitar proyecto del grupo
    batch.update(groupRef, {
      projects: arrayRemove(projectRef),
      projectCount: increment(-1),
      updatedAt: serverTimestamp()
    });

    // Quitar referencia del grupo en el proyecto
    batch.update(projectRef, {
      groups: arrayRemove(groupRef)
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

    // Obtener los datos completos de cada proyecto
    const projects = await Promise.all(
      groupData.projects.map(async (projectRef) => {
        const projectDoc = await getDoc(projectRef);
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
