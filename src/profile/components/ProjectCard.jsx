import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useAuth } from "../../auth/hooks/useAuth";
import { FaGithub } from "react-icons/fa";
import { MdDatasetLinked } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { LuEraser } from "react-icons/lu";
import DeleteModal from "../../common/components/DeleteModal";
import { deleteProject } from "../../profile/services/projectService";
import formatDate from "../../utils/dateFormatter";
import { Timestamp } from "firebase/firestore";

//import { toggleLike } from "../services/projectService";

const ProjectCard = ({
  id,
  title,
  description,
  likes,
  authorId,
  authorName,
  authorPhoto,
  createdAt,
  linkRepo,
  linkDemo,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false); // Estado para rastrear si se ha dado "like"
  const [likeCount, setLikeCount] = useState(likes);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const authorAvatar = authorPhoto ? authorPhoto : defaultAvatar;
  const navigate = useNavigate();


  // Formatear fecha
  const formattedDate = formatDate(createdAt)


  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked); // Alternar el estado de "like"
  };

  const handleEdit = () => {
    // Redirigir a la página de edición con el id del proyecto
    navigate(`/edit-project/${id}`, {
      state: {
        projectToEdit: { id, title, description, linkRepo, linkDemo, authorId },
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      console.log("Project successfully deleted");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/project/${id}`, {
      state: {
        project: {
          id,
          title,
          description,
          linkRepo,
          linkDemo,
          authorName,
          authorPhoto,
          createdAt
        },
      },
    });
  };

  return (
    <article className="flex flex-col justify-between bg-white rounded-lg shadow-md  mb-4">
      <div>
        {/* Header */}
        <div className="flex flex-col items-start justify-between my-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-start gap-1">
              <h2
                className="text-3xl font-semibold text-gray-800 px-4 hover:underline cursor-pointer"
                onClick={handleViewDetails}
              >
                {title}
              </h2>

              <div className="flex items-center justify-start gap-1 px-4 ">
                <img
                  src={authorAvatar}
                  alt={`${authorName}'s avatar`}
                  className="size-6 rounded-full "
                />
                <h3 className="text-md font-mono text-gray-500 ">
                  {authorName}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start justify-center ">
              <a
                className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456]"
                href={linkRepo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-lg" />
                Repositorie
              </a>

              {linkDemo && (
                <a
                  className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456]"
                  href={linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdDatasetLinked className="text-lg" />
                  Link Demo
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t w-full border-gray-200 my-2" />
        {/* Renderizar la descripción en formato Markdown */}
        <div
          className="prose prose-sm w-full max-w-none text-gray-600 p-4 mb-4 cursor-pointer"
          onClick={handleViewDetails}
        >
          <ReactMarkdown>{`${description.slice(0, 150)}...`}</ReactMarkdown>
          {description.length > 100 && (
            <button className="text-blue-500 hover:underline mt-2 cursor-pointer">
              Ver más
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col justify-between items-start text-sm text-gray-500">
        <hr className="border-t w-full border-gray-200 " />
        <div className="flex items-center justify-between w-full p-4">
          <button
            onClick={handleLike}
            className="flex text-gray-500 hover:text-blue-700 transition duration-300 cursor-pointer"
          >
            {isLiked ? (
              <AiFillLike className="text-xl text-blue-700" />
            ) : (
              <AiOutlineLike className="text-xl" />
            )}
            {likeCount}
          </button>
          <div className="flex items-center justify-between gap-2">
            {user && user.uid === authorId && (
              <div className="flex items-center gap-2">
                <RiEditLine
                  onClick={handleEdit}
                  className="text-xl text-gray-500 cursor-pointer hover:text-blue-700"
                />
                <LuEraser
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xl text-gray-500 cursor-pointer hover:text-red-700"
                />
              </div>
            )}
            <span className="text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          project={{ id, title }}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </article>
  );
};

export default ProjectCard;
