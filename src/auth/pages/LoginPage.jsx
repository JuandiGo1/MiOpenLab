import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-b from-blue-500 to-blue-900 text-white flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold mb-4">MiOpenLab</h1>
        <p className="text-xl mb-2">Share your Job!</p>
        <p className="text-lg">#LetsGO</p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;