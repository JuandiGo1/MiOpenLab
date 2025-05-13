import {useState, useEffect} from "react";
import Loader from "./Loader";

const NotFound = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const theme = localStorage.getItem("theme");
      setIsDarkMode(theme === "dark");
    }, []);  
  
  return (
    <div className={`${isDarkMode? 'bg-gray-800':'bg-gray-200'} flex flex-col  gap-2 justify-center items-center min-h-screen `}>
      <h1 className={`text-4xl font-bold ${isDarkMode? 'text-white':'text-gray-800'} mb-1`}>404 Page not found</h1>
      <h3 className={`text-2xl font-bold ${isDarkMode? 'text-white':'text-gray-800'} mb-1`}>Oops! Looks like the page you're trying to access not exist</h3>
      <button>
        <a href="/home" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ${isDarkMode? 'dark:bg-blue-700 dark:hover:bg-blue-800' : ''}`}>
          Go to Home
        </a>
      </button>
    </div>
  );
};

export default NotFound;