import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col sm:flex-row w-screen h-screen overflow-hidden bg-[#EAE0D5]">
      {/* Left Section */}
      <div
        className="flex-1 bg-[#1c2930] dark:bg-black dark:text-red-600 text-white flex flex-col justify-center items-center p-4"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 sm:mb-4">
          MiOpenLab
        </h1>
        <p className="text-xl mb-2">Share your Job!</p>
        <p className="text-lg hidden sm:block">#LetsGO</p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#EAEOD5] w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
