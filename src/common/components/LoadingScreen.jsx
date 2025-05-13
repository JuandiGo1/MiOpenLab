import {useState, useEffect} from "react";
import Loader from "./Loader";

const LoadingScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      const theme = localStorage.getItem("theme");
      setIsDarkMode(theme === "dark");
    }, []);  
  
  return (
    <div className={`${isDarkMode? 'bg-gray-800':'bg-gray-200'} flex flex-col justify-center items-center min-h-screen `}>
      <h1 className={`text-4xl font-bold ${isDarkMode? 'text-white':'text-gray-800'} mb-1`}>MiOpenLab</h1>
      <Loader color={!isDarkMode ? "#bd9260" : "#5858FA"}/>
    </div>
  );
};

export default LoadingScreen;