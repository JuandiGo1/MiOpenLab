import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getProjectById } from "../../profile/services/projectService";
import { FaGithub } from "react-icons/fa";
import { MdDatasetLinked } from "react-icons/md";
import DefaultAvatar from "../../assets/defaultAvatar.jpg";
import DetailsSkeleton from "../components/ProjectDetailsSkeleton";
import formatDate from "../../utils/dateFormatter";

const ProjectDetails = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL
  const location = useLocation(); // Obtener la info del proyecto desde el estado de la navegacion
  const navigate = useNavigate();
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!project);

  useEffect(() => {
    // Si no se pasa el proyecto en el estado, buscarlo en la base de datos
    if (!project) {
      const fetchProject = async () => {
        try {
          const fetchedProject = await getProjectById(id);
          setProject(fetchedProject);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching project:", error);
          navigate("/explore");
        }
      };

      fetchProject();
    }
  }, [id, project, navigate]);

  if (loading) {
    return (
      <DetailsSkeleton></DetailsSkeleton>
    );
  }

  if (!project) {
    return <p className="text-center text-red-500">Project not found.</p>;
  }

  const {
    title,
    description,
    linkRepo,
    linkDemo,
    authorName,
    authorPhoto,
    createdAt,
  } = project;

  console.log(typeof createdAt)
  const formattedDate = formatDate(createdAt)

  return (
    <div className="w-full  mx-auto p-6 bg-white shadow-md">
      <div className="flex items-center mb-6">
        <img
          src={authorPhoto || DefaultAvatar}
          alt={`${authorName}'s avatar`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">By {authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="w-full prose prose-lg max-w-none text-gray-600 mb-6">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>

      <div className="flex gap-4">
        {linkRepo && (
          <a
            href={linkRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FaGithub className="text-xl" />
            Repository
          </a>
        )}
        {linkDemo && (
          <a
            href={linkDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <MdDatasetLinked className="text-xl" />
            Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
