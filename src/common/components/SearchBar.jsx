import { GoSearch } from "react-icons/go";
import { useState, useEffect } from "react";
import { searchProjects } from "../../profile/services/projectService";

const SearchBar = ({ onResults, setMsgInfo }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          const res = await searchProjects(searchTerm);
          setMsgInfo(res.length === 0 ? "No results found, showing all projects." : "");
          onResults(res);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setMsgInfo("Error searching projects");
        }
      } else {
        setMsgInfo("");
        onResults([]); // limpia 
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onResults, setMsgInfo]);

  return (
    <form className="w-full max-w-md ml-0" onSubmit={(e) => e.preventDefault()}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <GoSearch className="text-gray-400" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </form>
  );
};

export default SearchBar;
