import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ProfileHeader from "../components/ProfileHeader";
import TopProjectsBar from "../../common/components/TopProjects";
import { getUserProjects } from "../services/projectService";
import { getUserProfileByUsername } from "../../auth/services/userService";
import { useAuth } from "../../auth/hooks/useAuth";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";
import FollowersList from "../components/FollowersList";
import FollowingList from "../components/FollowingList";
import LikesList from "../components/LikesList";
import Loader from "../../common/components/Loader";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]); // Estado para almacenar los proyectos
  const [loading, setLoading] = useState(true);
  const [countPosts, setCountPosts] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
   const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);  

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

  // Renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <ProjectSkeleton key={index} />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case "posts":
        return projects.length === 0 ? (
          user.username == username ? (
            <div className="flex items-center justify-center w-full h-64">
              <NavLink
                to="/newproject"
                className="flex items-center justify-center text-center text-white font-bold bg-[#bd9260] rounded-full w-35 gap-1 px-4 py-3 hover:bg-[#ce9456]/80 transition duration-300 ease-in-out"
              >
                New Project
              </NavLink>
            </div>
          ) : (
            <p className="flex justify-center items-center w-full h-64 text-gray-500">
              No projects yet.
            </p>
          )
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        );
      case "followers":
        return <FollowersList userId={profileUser?.uid} />;
      case "following":
        return <FollowingList userId={profileUser?.uid} />;
      case "likes":
        return <LikesList userId={profileUser?.uid} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100  min-h-screen dark:bg-[#181818]">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Header */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[#333333]">
            <Loader color={!isDarkMode ? "#bd9260" : "#5858FA"} h={"h-35"}/>
          </div>
          
        ) : (
          <ProfileHeader
            countPosts={countPosts}
            currentUserUsername={user.username}
            currentUserUserUid={user.uid}
            currentUserFollows={user.following}
            {...profileUser}
          />
        )}

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 cursor-pointer ${
              activeTab === "posts"
                ? "border-b-2 border-[#bd9260]  dark:border-blue-600 dark:text-gray-50"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`pb-2 cursor-pointer ${
              activeTab === "followers"
                ? "border-b-2 border-[#bd9260]  dark:border-blue-600 dark:text-gray-50"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`pb-2 cursor-pointer ${
              activeTab === "following"
                ? "border-b-2 border-[#bd9260]  dark:border-blue-600 dark:text-gray-50"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`pb-2 cursor-pointer ${
              activeTab === "likes"
                ? "border-b-2 border-[#bd9260]  dark:border-blue-600 dark:text-gray-50"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Likes
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      <TopProjectsBar />
    </div>
  );
};

export default ProfilePage;
