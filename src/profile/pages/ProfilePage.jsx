import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";
import SearchBar from "../../common/components/SearchBar";
import { getUserProjects } from "../services/projectService";
import { useAuth } from "../../auth/hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
  const [loading, setLoading] = useState(true);

  // Cargar los proyectos del usuario
  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        const userProjects = await getUserProjects(user.uid);
        setProjects(userProjects);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="flex bg-gray-100 dark:bg-[#10151a] min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Header */}
        <ProfileHeader></ProfileHeader>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button className="pb-2 border-b-2 border-blue-600">Posts</button>
          <button className="pb-2 text-gray-600">Followers</button>
          <button className="pb-2 text-gray-600">Likes</button>
        </div>

        {/* Posts Section */}
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        )}
      </main>

      <SearchBar></SearchBar>
    </div>
  );
};

export default ProfilePage;
