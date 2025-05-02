import { useState } from "react";

const DeleteModal = ({ project, onDelete, onClose }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");

  const expectedText = `delete-${project.title}`;

  const handleDelete = () => {
    if (confirmationText === expectedText) {
      onDelete(project.id);
      setError("Deleting..."); // Llama a la función de eliminación
      
    } else {
      setError("The entered text does not match. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-red-600">
          Confirm deletion
        </h2>
        <p className="mb-4 text-gray-700">
          To delete the project <strong>{project.title}</strong>, write{" "}
          <strong><em>{`${expectedText}`}</em></strong> on the input below.
        </p>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          placeholder={`Enter "${expectedText}"`}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmationText !== expectedText}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              confirmationText === expectedText
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;