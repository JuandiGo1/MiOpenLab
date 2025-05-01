import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createProject } from "../../profile/services/projectService";
import { useAuth } from "../../auth/hooks/useAuth";

const CreatePostField = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkRepo, setLinkRepo] = useState("");
  const [linkDemo, setLinkDemo] = useState("");
  const [msgInfo, setMsgInfo] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      await createProject(projectData, user);
      setMsgInfo("Project created successfully!");
      setTitle("");
      setDescription("");
      setLinkRepo("");
      setLinkDemo("");
    } catch (error) {
      setMsgInfo("Error creating project. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mt-4">
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter project title"
          />
        </div>

        {/* Link to Repository */}
        <div className="mb-4">
          <label
            htmlFor="linkRepo"
            className="block text-gray-700 font-bold mb-2"
          >
            Repository Link
          </label>
          <input
            id="linkRepo"
            type="url"
            value={linkRepo}
            onChange={(e) => setLinkRepo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter repository link"
          />
        </div>

        {/* Link to Demo */}
        <div className="mb-4">
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter demo link"
          />
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
            value={description}
            //onChange={(value) => setDescription(value)}
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
          <span className="text-sm text-gray-500">{msgInfo}</span>
        </div>
      </form>
    </div>
  );
};

export default CreatePostField;