import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";
import SearchBar from "../../common/components/SearchBar";
import { getUserProjects } from "../services/projectService";
import { getUserProfileByUsername } from "../../auth/services/userService";
import { useAuth } from "../../auth/hooks/useAuth";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
  const [loading, setLoading] = useState(true);
  const [countPosts, setCountPosts] = useState(0);

  useEffect(() => {
    const fetchProfileUser = async () => {
      const userProfile = await getUserProfileByUsername(username);
      setProfileUser(userProfile);
      if (userProfile) {
        const userProjects = await getUserProjects(userProfile.uid); // Obtener proyectos del usuario
        setProjects(userProjects);
        setCountPosts(userProjects.length);
      }
      setLoading(false);
    };

    fetchProfileUser();
  }, [username]);

  return (
    <div className="flex bg-gray-100  min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Header */}
        <ProfileHeader countPosts={countPosts} currentUserUsername={user.username} {...profileUser} />

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button className="pb-2 border-b-2 border-blue-600">Posts</button>
          <button className="pb-2 text-gray-600">Followers</button>
          <button className="pb-2 text-gray-600">Likes</button>
        </div>

        {/* Posts Section */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
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
