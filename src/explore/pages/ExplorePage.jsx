import { useState, useEffect, useCallback, Fragment } from "react";
import TopProjectsBar from "../../common/components/TopProjects";
import ProjectCard from "../../profile/components/ProjectCard";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";
import { getAllProjects } from "../../profile/services/projectService";
import SearchBar from "../../common/components/SearchBar";
import SortButtons from "../components/SortButtons";

const ExplorePage = () => {
  const [projects, setProjects] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [msgInfo, setMsgInfo] = useState("");

  // Cargar todos los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleResults = useCallback((data) => {
    setSearchResults(data);
  }, []);

  const handleMsgInfo = useCallback((msg) => {
    setMsgInfo(msg);
  }, []);

  const sortProjects = (order) => {
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = a.createdAt.seconds;
      const dateB = b.createdAt.seconds;

      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    

    setProjects(sortedProjects);
    setSortOrder(order);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex flex-col w-full mb-0">
            <SearchBar onResults={handleResults} setMsgInfo={handleMsgInfo} />

            <span className="text-gray-800 text-sm mt-2">{msgInfo}</span>
          </div>

          <div className="flex items-center mb-2">
            {/* Botones para ordenar */}
            <SortButtons
              currentSortOrder={sortOrder}
              onSortChange={sortProjects} />
          </div>
        </div>

        {/* Mostrar skeletons mientras cargan los proyectos */}
        {loading ? (
          <div className="grid grid-cols-1  gap-6">
            {[...Array(6)].map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1  gap-6">
            {searchResults.map((project) => (
              <ProjectCard key={project.id} {...project} />
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
      <TopProjectsBar />
    </div>
  );
};

export default ExplorePage;
