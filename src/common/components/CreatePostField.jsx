import { useState, useRef, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createProject } from "../../profile/services/projectService";
import { useAuth } from "../../auth/hooks/useAuth";
import { FaGithub } from "react-icons/fa";
import { editProject } from "../../profile/services/projectService";

const CreatePostField = () => {
  const location = useLocation();
  const projectToEdit = location.state?.projectToEdit || null;

  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [linkRepo, setLinkRepo] = useState("");
  const [linkDemo, setLinkDemo] = useState("");
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();

  //para capturar el valor del editor md sin que pierda el foco
  const descriptionRef = useRef("");

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setLinkRepo(projectToEdit.linkRepo || "");
      setLinkDemo(projectToEdit.linkDemo || "");
      descriptionRef.current = projectToEdit.description || "";
    }
  }, [projectToEdit]);

  //Evitar que el usuario acceda a editar un proyecto si no es el autor del proyecto
  if (projectToEdit && user.uid !== projectToEdit?.authorId) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const description = descriptionRef.current;

    if (!title.trim() || !description.trim()) {
      setMsgInfo("Title and description are required!");
      return;
    }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      linkRepo: linkRepo.trim() || null,
      linkDemo: linkDemo.trim() || null,
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
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl my-5">
      <h2 className="text-xl text-[#1c2930] font-bold mb-4">
        Create New Project
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none "
            placeholder="Enter project title"
          />
        </div>

        <div className="flex justify-between gap-3 w-full">
          {/* Link to Repository */}
          <div className="flex-1 mb-4">
            <label
              htmlFor="linkRepo"
              className="flex gap-1 items-center text-gray-700 font-bold mb-2"
            >
              Repository Link <FaGithub className="text-xl" />
            </label>
            <input
              id="linkRepo"
              type="url"
              value={linkRepo}
              onChange={(e) => setLinkRepo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none "
              placeholder="Enter repository link"
            />
          </div>

          {/* Link to Demo */}
          <div className="flex-1 mb-4">
            <label
              htmlFor="linkDemo"
              className="block text-gray-700 font-bold mb-2"
            >
              Demo Link (Optional)
            </label>
            <input
              id="linkDemo"
              type="url"
              value={linkDemo}
              onChange={(e) => setLinkDemo(e.target.value)}
              className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none "
              placeholder="Enter demo link"
            />
          </div>
        </div>

        {/* Description (Markdown Editor) */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <SimpleMDE
            id="description"
            value={descriptionRef.current}
            onChange={(value) => (descriptionRef.current = value)}
            options={{
              spellChecker: false,
              placeholder: "Write your project description in Markdown...",
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-[#bd9260] text-white text-center font-bold px-4 py-2 w-20 rounded-lg hover:bg-[#ce9456]/80  cursor-pointer transition duration-300 ease-in-out"
          >
            {projectToEdit ? "Save" : "Post"}
          </button>
          <span className="text-sm text-green-900">{msgInfo}</span>
        </div>
      </form>
    </div>
  );
};

export default CreatePostField;
