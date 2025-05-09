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
      try {
        const likedProjectIds = await getUserLikes(userId);

        // Obtener la información de cada proyecto
        const projectsData = await Promise.all(
          likedProjectIds.map(async (projectId) => {
            const project = await getProjectById(projectId);
            return project;
          })
        );

        setLikedProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked projects:", error);
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
