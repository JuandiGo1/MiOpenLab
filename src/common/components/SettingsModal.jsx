import React, { useState, useEffect } from "react";

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 32;

const getFontSize = () => {
  const val = localStorage.getItem("font-size-base");
  return val ? parseInt(val, 10) : 16;
};

const SettingsModal = ({ isOpen, onClose }) => {
  const [fontSize, setFontSize] = useState(getFontSize());

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size-base", fontSize + "px");
    localStorage.setItem("font-size-base", fontSize);
  }, [fontSize]);

  const increaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE));
  };
  const decreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE));
  };

  if (!isOpen) return null;

  // Handler to close modal when clicking outside content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-[#222] rounded-lg shadow-lg p-6 w-full max-w-xs relative" onClick={e => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 dark:text-white">Accesibility</h2>
        <div className="flex flex-col gap-4">
          <div>
            <span className="block mb-2 dark:text-white">Font Size</span>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseFont}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                aria-label="Disminuir tamaño de fuente"
                disabled={fontSize <= MIN_FONT_SIZE}
              >
                A-
              </button>
              <span className="w-10 text-center dark:text-white">{fontSize}px</span>
              <button
                onClick={increaseFont}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                aria-label="Aumentar tamaño de fuente"
                disabled={fontSize >= MAX_FONT_SIZE}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
