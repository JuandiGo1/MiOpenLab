import { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import SearchBar from "../../common/components/SearchBar";
import ProjectCard from "../../profile/components/ProjectCard";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";
import { getAllProjects } from "../../profile/services/projectService";

const ExplorePage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const profileImage = user?.photoURL || defaultAvatar;

  // Cargar todos los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <main className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full object-cover mr-4"
          />
          <h1 className="text-xl font-bold">
            ¡Hola, {user ? user.displayName : "Usuario"}!
          </h1>
        </div>

        

        {/* Mostrar skeletons mientras cargan los proyectos */}
        {loading ? (
          <div className="grid grid-cols-1  gap-6">
            {[...Array(6)].map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1  gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </main>
      <SearchBar />
    </div>
  );
};

export default ExplorePage;