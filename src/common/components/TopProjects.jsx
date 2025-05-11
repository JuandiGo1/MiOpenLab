import { useState, useEffect } from "react";
import { getTopProjects } from "../../profile/services/projectService";
import TopProjectCard from "./TopProjectCard";

const TopProjectsBar = () => {
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <aside className="w-1/5 bg-white p-6 shadow-md sticky top-0">
      <h2 className="text-lg font-bold mb-4">Top Projects</h2>
      {loading ? (
        <p className="text-gray-500">Loading top projects...</p>
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
