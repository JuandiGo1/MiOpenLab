import { useState, useRef, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createProject } from "../../profile/services/projectService";
import { useAuth } from "../../auth/hooks/useAuth";
import { FaGithub } from "react-icons/fa";
import { BiSolidImageAdd } from "react-icons/bi";
import { editProject } from "../../profile/services/projectService";
import { NewLoader } from "../../common/components/Loader";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const CreatePostField = () => {
  const location = useLocation();
  const projectToEdit = location.state?.projectToEdit || null;

  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [linkRepo, setLinkRepo] = useState("");
  const [linkDemo, setLinkDemo] = useState("");
  const [isPublic, setIsPublic] = useState(true); // New state for visibility
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //para capturar el valor del editor md sin que pierda el foco
  const descriptionRef = useRef("");

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setLinkRepo(projectToEdit.linkRepo || "");
      setLinkDemo(projectToEdit.linkDemo || "");
      descriptionRef.current = projectToEdit.description || "";
      setIsPublic(
        projectToEdit.isPublic === undefined ? true : projectToEdit.isPublic
      ); // Set isPublic from projectToEdit
    }
  }, [projectToEdit]);

  //Evitar que el usuario acceda a editar un proyecto si no es el autor del proyecto
  if (projectToEdit && user.uid !== projectToEdit?.authorId) {
    return <Navigate to="/home" replace />;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = descriptionRef.current;

    if (!title.trim() || !description.trim()) {
      setMsgInfo("Title and description are required!");
      return;
    }

    setIsLoading(true);

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      linkRepo: linkRepo.trim() || null,
      linkDemo: linkDemo.trim() || null,
      isPublic: isPublic, // Include isPublic in projectData
      image: image || "",
    };

    try {
      if (projectToEdit) {
        // Editar proyecto existente
        await editProject(projectToEdit.id, projectData);
        setMsgInfo("Project updated successfully!");
      } else {
        // Crear nuevo proyecto
        await createProject(projectData, user);
        setMsgInfo("Project created successfully!");
      }

      setTitle("");
      descriptionRef.current = "";
      setLinkRepo("");
      setLinkDemo("");
      setTimeout(() => {
        navigate(`/profile/${user.username}`);
      }, 2000);
    } catch (error) {
      setMsgInfo("Error saving project. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl my-5 dark:bg-[#333]">
      <h2 className="text-xl text-[#1c2930] font-bold mb-4 dark:text-white">
        Create New Project
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
            placeholder="Enter project title"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between gap-3 w-full">
          {/* Link to Repository */}
          <div className="flex-1 mb-4">
            <label
              htmlFor="linkRepo"
              className="flex gap-1 items-center text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Repository Link <FaGithub className="text-xl" />
            </label>
            <input
              id="linkRepo"
              type="url"
              value={linkRepo}
              onChange={(e) => setLinkRepo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              placeholder="Enter repository link"
              disabled={isLoading}
            />
          </div>

          {/* Link to Demo */}
          <div className="flex-1 mb-4">
            <label
              htmlFor="linkDemo"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Demo Link (Optional)
            </label>
            <input
              id="linkDemo"
              type="url"
              value={linkDemo}
              onChange={(e) => setLinkDemo(e.target.value)}
              className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              placeholder="Enter demo link"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Project Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Project Image (optional)
          </label>

          <div
            className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() =>
              !isLoading &&
              document.getElementById("projectImageInput")?.click()
            }
          >
            <input
              id="projectImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="hidden"
            />
            {isLoading ? (
              <NewLoader size="20" color="#bd9260" h="h-auto" />
            ) : (
              <div className="flex flex-col items-center text-gray-600 dark:text-gray-300">
                <BiSolidImageAdd size={28} />
                <p className="text-sm mt-1">Click to upload a project image</p>
              </div>
            )}
          </div>

          {imagePreview && (
            <div className="mt-4 relative w-fit">
              <PhotoProvider>
                <PhotoView src={imagePreview}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-36 object-cover rounded-xl border shadow cursor-pointer hover:opacity-90 transition"
                  />
                </PhotoView>
              </PhotoProvider>
              {/* Botón para eliminar imagen */}
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview("");
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition cursor-pointer"
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Description (Markdown Editor) */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
          >
            Description
          </label>
          <SimpleMDE
            id="description"
            className="w-full border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500 dark:placeholder-gray-400 "
            value={descriptionRef.current}
            onChange={(value) => (descriptionRef.current = value)}
            options={{
              spellChecker: false,
              placeholder: "Write your project description in Markdown...",
              readOnly: isLoading,
            }}
          />
        </div>

        {/* Visibility Toggle */}
        <div className="mb-4">
          <label
            htmlFor="isPublic"
            className="flex items-center text-gray-700 font-bold dark:text-gray-100"
          >
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
            />
            Public (visible to everyone)
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#bd9260] text-white text-center font-bold px-4 py-2 w-20 rounded-lg hover:bg-[#ce9456]/80  cursor-pointer transition duration-300 ease-in-out
            dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
          >
            {isLoading ? (
              <NewLoader size="20" color="white" h="h-auto" />
            ) : projectToEdit ? (
              "Save"
            ) : (
              "Post"
            )}
          </button>
          <span className="text-sm text-green-900">{msgInfo}</span>
        </div>
      </form>
    </div>
  );
};

export default CreatePostField;
