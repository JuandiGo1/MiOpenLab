import { db } from "../../firebase/Config"; // Ajusta la ruta si es necesario
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { getUserProfile } from "../../auth/services/userService"; // Servicio para obtener el perfil del usuario

/**
 * Obtiene el feed personalizado para un usuario.
 * Busca proyectos públicos de los usuarios que el usuario actual sigue.
 *
 * @param {string} currentUserId - El UID del usuario actual.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de proyectos.
 *                           Devuelve un array vacío si el usuario no sigue a nadie,
 *                           o si los usuarios seguidos no tienen proyectos públicos.
 */
export async function getPersonalizedFeed(currentUserId) {
  if (!currentUserId) {
    console.warn("getPersonalizedFeed: currentUserId no fue proporcionado.");
    return [];
  }

  try {
    const userProfile = await getUserProfile(currentUserId);

    if (!userProfile || !userProfile.following || userProfile.following.length === 0) {
      console.log("El usuario no sigue a nadie o no se encontró la lista de seguidos.");
      return []; // El usuario no sigue a nadie, el feed estará vacío
    }

    const followedUIDs = userProfile.following;

    // Firestore 'in' queries now support up to 30 comparison values.
    // Si un usuario sigue a más de 30 personas, la consulta funcionará correctamente.
    // Si el límite fuera menor (ej. 10 en versiones antiguas o configuraciones específicas),
    // se necesitaría dividir la consulta en múltiples partes.
    if (followedUIDs.length === 0) {
        console.log("La lista de followedUIDs está vacía después de obtener el perfil.");
        return [];
    }
    
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef,
      where("authorId", "in", followedUIDs),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    return projects;
  } catch (error) {
    console.error("Error obteniendo el feed personalizado:", error);
    // Considera devolver un error o un estado que la UI pueda interpretar
    return []; // Devuelve un array vacío en caso de error para evitar que la UI se rompa
  }
}

