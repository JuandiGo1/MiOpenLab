import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import DarkSwitch from "../../common/components/ThemeSwitch";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const handleThemeChange = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-screen h-screen overflow-hidden relative">
      {/* DarkSwitch Button */}
      <div className="absolute top-4 right-4">
        <DarkSwitch checked={darkMode} onChange={handleThemeChange} />
      </div>

      {/* Left Section */}
      <div className="flex-1 bg-[#1c2930] flex flex-col justify-center items-center text-white p-4 dark:bg-[#1c2930]">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-4">
          MiOpenLab
        </h1>
        <p className="text-xl mb-2">Share your Job!</p>
        <p className="text-lg hidden sm:block">#LetsGO</p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#EAE0D5] w-full dark:bg-gray-900">
        {isLogin ? (
          <LoginForm setIsLogin={setIsLogin} />
        ) : (
          <SignupForm setIsLogin={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
