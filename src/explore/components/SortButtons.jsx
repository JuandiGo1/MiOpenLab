import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi'; // Importamos iconos

const SortButtons = ({ currentSortOrder, onSortChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Estado para saber si un filtro ha sido explícitamente seleccionado por el usuario
  // Esto ayuda a diferenciar el estado inicial "outlined" del botón.
  const [filterApplied, setFilterApplied] = useState(false);
  const menuRef = useRef(null);

  const handleSortOptionClick = (order) => {
    onSortChange(order);
    setIsMobileMenuOpen(false);
    setFilterApplied(true); // Marcar que un filtro ha sido aplicado
  };

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Determinar el texto del botón móvil
  const buttonText = filterApplied
    ? `${currentSortOrder === "newest" ? "Más nuevos" : "Más antiguos"}`
    : "Filtros";

  return (
    <div className="relative w-full md:w-auto" ref={menuRef}>
      {/* Botón para abrir menú en móviles (oculto en md y superior) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`w-full text-left flex justify-between items-center p-4 text-sm rounded-lg shadow-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${ // MODIFICADO: Añadido text-sm
            filterApplied
              ? "bg-[#bd9260] text-white font-semibold hover:bg-[#ca9c6e] focus:ring-[#bd9260] dark:bg-[#5858FA] dark:hover:bg-[#6e6eff] dark:focus:ring-[#5858FA]" // Estilo FILLED cuando hay filtro
              : "border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:ring-gray-400" // Estilo OUTLINED inicial
          }`} 
          aria-haspopup="true"
          aria-expanded={isMobileMenuOpen}
          aria-controls="sort-menu-mobile"
        >
          <span>{buttonText}</span>
          <FiChevronDown
            className={`w-5 h-5 transform transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-180" : ""
            } ${filterApplied ? "text-white" : "text-gray-500"}`}
          />
        </button>
        {isMobileMenuOpen && (
          <div
            id="sort-menu-mobile"
            className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl py-2 transition-opacity duration-150 ease-out dark:bg-gray-700 dark:border-gray-800"
            role="menu"
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Seleccionar orden</h3>
            </div>
            {[
              { label: "Más nuevos", value: "newest" },
              { label: "Más antiguos", value: "oldest" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortOptionClick(option.value)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex justify-between items-center ${
                  currentSortOrder === option.value
                    ? "text-[#bd9260] font-semibold bg-[#bd9260]/10 dark:bg-[#5858FA]/80 dark:text-gray-50" // Opción activa con fondo ligero y texto dorado
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600" // Opción inactiva
                }`}
                role="menuitem"
              >
                {option.label}
                {currentSortOrder === option.value && (
                  <FiCheck className="w-5 h-5 text-[#bd9260] dark:text-white" /> // Checkmark para la opción activa
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Botones originales para pantallas medianas y grandes (md y superior) */}
      <div className="hidden md:flex justify-end md:border-b md:border-gray-200">
        <button
          onClick={() => onSortChange("newest")}
          className={`relative py-4 px-4 mr-4 font-medium text-center cursor-pointer transition-colors duration-300 ease-out focus:outline-none ${
            currentSortOrder === "newest"
              ? "text-black font-semibold" // Texto activo blanco para mejor contraste
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Más nuevos
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] w-16 bg-[#bd9260] rounded-full transform transition-transform duration-300 ease-out ${ // Barra activa color dorado
              currentSortOrder === "newest" ? "scale-x-100" : "scale-x-0"
            }`}
          ></span>
        </button>
        <button
          onClick={() => onSortChange("oldest")}
          className={`relative py-4 px-4 font-medium text-center cursor-pointer transition-colors duration-300 ease-out focus:outline-none ${
            currentSortOrder === "oldest"
              ? "text-black font-semibold" // Texto activo blanco
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Más antiguos
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] w-16 bg-[#bd9260] rounded-full transform transition-transform duration-300 ease-out ${ // Barra activa color dorado
              currentSortOrder === "oldest" ? "scale-x-100" : "scale-x-0"
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default SortButtons;