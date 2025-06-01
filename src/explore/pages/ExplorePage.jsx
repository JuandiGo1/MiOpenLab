import { useState, useEffect, useCallback, Fragment } from "react";
import TopProjectsBar from "../../common/components/TopProjects";
import ProjectCard from "../../profile/components/ProjectCard";
import ProjectSkeleton from "../../common/components/ProjectSkeleton";
import { getAllProjects } from "../../profile/services/projectService";
import SearchBar from "../../common/components/SearchBar";
import SortButtons from "../components/SortButtons";
import { useAuth } from "../../auth/hooks/useAuth";
import { getPersonalizedFeed } from "../services/feedService";

const ExplorePage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [msgInfo, setMsgInfo] = useState("");
  const [activeView, setActiveView] = useState("discover");

  // Cargar proyectos según activeView y user
  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      setMsgInfo(""); // Limpiar mensajes anteriores
      setProjects([]); // Limpiar proyectos antes de una nueva carga
      setSearchResults([]); // Limpiar resultados de búsqueda también

      try {
        let fetchedProjects;
        if (activeView === "discover") {
          fetchedProjects = await getAllProjects();
          if (fetchedProjects.length === 0) {
            setMsgInfo("There are no projects to show at this time.");
          }
        } else {
          // activeView === "following"
          if (user && user.uid) {
            fetchedProjects = await getPersonalizedFeed(user.uid);
            if (fetchedProjects.length === 0) {
              setMsgInfo(
                "Nothing here yet. Follow other users or explore new projects."
              );
            }
          } else {
            fetchedProjects = []; // No hay usuario, así que no hay feed personalizado
            setMsgInfo("Sign in to see projects from users you follow.");
          }
        }
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setMsgInfo("Error al cargar los proyectos.");
        setProjects([]); // Asegurar que projects sea un array en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [activeView, user]); // Dependencias actualizadas

  const handleResults = useCallback((data) => {
    setSearchResults(data);
    // Cuando hay resultados de búsqueda, msgInfo de SearchBar podría tomar precedencia.
    // Si se quiere que la vista "discover" se active con la búsqueda:
    // if (activeView !== 'discover') setActiveView('discover');
  }, []);

  const handleMsgInfo = useCallback((msg) => {
    setMsgInfo(msg);
  }, []);

  // Modificado para ordenar searchResults o projects
  const sortProjectsHandler = (order) => {
    const dataToSort =
      searchResults.length > 0 ? [...searchResults] : [...projects];

    const sortedData = dataToSort.sort((a, b) => {
      const timeA =
        a.createdAt && typeof a.createdAt.seconds === "number"
          ? a.createdAt.seconds
          : 0;
      const timeB =
        b.createdAt && typeof b.createdAt.seconds === "number"
          ? b.createdAt.seconds
          : 0;
      return order === "newest" ? timeB - timeA : timeA - timeB;
    });

    if (searchResults.length > 0) {
      setSearchResults(sortedData);
    } else {
      setProjects(sortedData);
    }
    setSortOrder(order);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen min-w-[320px] dark:bg-[#181818]">
      <main className="flex-1 p-6 min-w-0">
        {/* Row 1: SearchBar and SortButtons */}
        <div className="flex items-center justify-between mb-1 gap-4">
          <div className="flex flex-col w-full mb-0 min-w-0">
            <SearchBar onResults={handleResults} setMsgInfo={handleMsgInfo} />
            {/* msgInfo se mostrará aquí, ya sea de fetchProjectsData o de SearchBar */}
            <span className="text-gray-800 text-sm mt-2 dark:text-gray-300 break-words">
              {msgInfo}
            </span>
          </div>
          <div className="flex items-center mb-2 flex-shrink-0">
            <SortButtons
              currentSortOrder={sortOrder}
              onSortChange={sortProjectsHandler}
            />{" "}
            {/* Usar el handler actualizado */}
          </div>
        </div>

        {/* Row 2: Toggle Buttons (NEW POSITION AND STYLE) */}
        <div className="mb-3 flex justify-left">
          <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 space-x-1">
            <button
              onClick={() => setActiveView("discover")}
              disabled={loading}
              className={`flex items-center gap-1 px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none ${activeView === "discover"
                  ? "bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-500 shadow-md"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveView("following")}
              disabled={loading}
              className={`flex items-center gap-1 px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none ${activeView === "following"
                  ? "bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-500 shadow-md"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Mostrar skeletons mientras cargan los proyectos */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
          </div>
        ) : searchResults.length > 0 || projects.length > 0 ? (
          // Si hay proyectos de búsqueda o de la vista actual
          <div className="grid grid-cols-1 gap-6">
            {(searchResults.length > 0 ? searchResults : projects).map(
              (project) => (
                <ProjectCard key={project.id} {...project} />
              )
            )}
          </div>
        ) : (
          // Si no hay skeletons, ni resultados de búsqueda, ni proyectos (área vacía)
          <div className="text-center py-10 mt-4">
            <p className="text-xl text-gray-600 dark:text-gray-400 break-words">
              {msgInfo || "There is no content to display."}
            </p>
            {/* Mensaje y CTA específico para el feed "Siguiendo" vacío */}
            {activeView === "following" &&
              user &&
              (!projects || projects.length === 0) &&
              (!searchResults || searchResults.length === 0) && (
                <p className="mt-4 text-md text-gray-500 dark:text-gray-500 break-words">
                  You can{" "}
                  <button
                    onClick={() => setActiveView("discover")}
                    className="text-blue-500 hover:underline focus:outline-none font-semibold"
                  >
                    explore more projects
                  </button>{" "}
                  to discover and follow new creators.
                </p>
              )}
          </div>
        )}
      </main>
      <TopProjectsBar />
    </div>
  );
};

export default ExplorePage;
