import React from 'react';

const SortButtons = ({ currentSortOrder, onSortChange }) => {
  return (
    <div className="flex justify-end mb-4 border-b border-gray-200">
      <button
        onClick={() => onSortChange("newest")}
        className={`relative py-4 px-4 mr-4 font-medium text-center cursor-pointer transition-colors duration-300 ease-out focus:outline-none ${
          currentSortOrder === "newest"
            ? "text-black font-semibold" // Asumiendo que quieres texto blanco para el activo
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Más nuevos
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] w-16 bg-sky-500 rounded-full transform transition-transform duration-300 ease-out ${
            currentSortOrder === "newest" ? "scale-x-100" : "scale-x-0"
          }`}
        ></span>
      </button>
      <button
        onClick={() => onSortChange("oldest")}
        className={`relative py-4 px-4 font-medium text-center cursor-pointer transition-colors duration-300 ease-out focus:outline-none ${
          currentSortOrder === "oldest"
            ? "text-black font-semibold" // Asumiendo que quieres texto blanco para el activo
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Más antiguos
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] w-16 bg-sky-500 rounded-full transform transition-transform duration-300 ease-out ${
            currentSortOrder === "oldest" ? "scale-x-100" : "scale-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default SortButtons;