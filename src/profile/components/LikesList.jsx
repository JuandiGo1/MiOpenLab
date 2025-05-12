import { useEffect, useState } from "react";
import { getUserLikes } from "../../auth/services/userService";
import { getProjectById } from "../services/projectService";
import ProjectCard from "./ProjectCard";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";

const LikesList = ({ userId }) => {
  const [likedProjects, setLikedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProjects = async () => {
      if (!userId) {
        setLoading(false);
        setLikedProjects([]);
        return;
      }
      setLoading(true);
      try {
        const likedProjectIds = await getUserLikes(userId);

        if (likedProjectIds && likedProjectIds.length > 0) {
          const projectsDataPromises = likedProjectIds.map(async (projectId) => {
            return await getProjectById(projectId); // Esto puede devolver null
          });
          const fetchedProjects = await Promise.all(projectsDataPromises);

          // Filtrar proyectos que sean null (no encontrados o eliminados)
          const validProjects = fetchedProjects.filter(project => project !== null);
          setLikedProjects(validProjects);
        } else {
          setLikedProjects([]); // No hay IDs de proyectos likeados
        }
      } catch (error) {
        console.error("Error fetching liked projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProjects();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Liked Projects ({likedProjects.length})
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {loading
          ? [...Array(3)].map((_, index) => <ProjectSkeleton key={index} />)
          : likedProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
      </div>
    </div>
  );
};

export default LikesList;
