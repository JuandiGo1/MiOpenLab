import React from "react";
import Loader from "./Loader";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 mb-1">MiOpenLab</h1>
      <Loader />
    </div>
  );
};

export default LoadingScreen;