import { useState, useEffect } from "react";
import { getTopProjects } from "../../profile/services/projectService";
import TopProjectCard from "./TopProjectCard";
import Loader from "../components/Loader";

const TopProjectsBar = () => {
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);  

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        const projects = await getTopProjects(3);
        setTopProjects(projects);
      } catch (error) {
        console.error("Error fetching top projects:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchTopProjects();
  }, []);

  return (
    <aside className="w-1/5 bg-white p-6 shadow-md sticky top-0 dark:bg-gray-900">
      <h2 className="text-lg font-bold mb-4 dark:text-white">Top Projects</h2>
      {loading ? (
        // <p className="text-gray-500 dark:text-gray-400">Loading top projects...</p> // Anterior
        <div className="flex justify-center items-center h-40"> {/* Contenedor para el loader */}
          <Loader size="30" color={!isDarkMode ? "#bd9260" : "#5858FA"} h="h-auto" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {topProjects.map((project) => (
            <TopProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              authorName={project.authorName}
              authorUsername={project.authorUsername}
              description={project.description}
            />
          ))}
        </div>
      )}
    </aside>
  );
};

export default TopProjectsBar;
