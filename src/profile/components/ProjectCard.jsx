import { useEffect, useState } from "react";
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
import { NewLoader } from "../../common/components/Loader";
import {
  deleteProject,
  addLike,
  removeLike,
} from "../../profile/services/projectService";
import formatDate from "../../utils/dateFormatter";
import {
  likePost,
  unlikePost,
  getUsernameById,
} from "../../auth/services/userService";

const ProjectCard = ({
  id,
  title,
  description,
  likes,
  authorId,
  authorName,
  authorUsername,
  authorPhoto,
  createdAt,
  linkRepo,
  linkDemo,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    user?.likedProjects?.includes(id) || false
  ); // Estado para rastrear si se ha dado "like"
  const [likeCount, setLikeCount] = useState(likes);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [authorProfileLink, setAuthorProfileLink]= useState('');
  const authorAvatar = authorPhoto ? authorPhoto : defaultAvatar;
  const navigate = useNavigate();
  // const authorProfileLink = authorUsername
  //   ? `/profile/${authorUsername}`
  //   : `/profile/${getUsernameById(authorId)}`;

  useEffect(() => {
    const fetchAuthorProfileLink = async () => {
      try {
        let username;
        if(!authorUsername){
           username = await getUsernameById(authorId);
        }else{
          username = authorUsername;
        }
        
        
        setAuthorProfileLink(`/profile/${username}`);
      } catch (error) {
        console.error("Error fetching author profile link:", error);
      }
    };

    fetchAuthorProfileLink();
  }, [authorId, authorUsername]);

  // Formatear fecha
  const formattedDate = formatDate(createdAt);

  const handleLike = async () => {
    if (isLoading) return; // Evitar múltiples clics mientras se procesa

    setIsLoading(true);

    try {
      if (isLiked) {
        // Quitar el like
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
        await unlikePost(user.uid, id);
        await removeLike(id, user.uid);
      } else {
        // Dar like
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
        await likePost(user.uid, id);
        await addLike(id, user.uid);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revertir cambios si hay error
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      setIsLiked((prev) => !prev);
    } finally {
      setIsLoading(false); // Marcar como completado
    }
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
    setIsDeleting(true); // Activar loader de borrado
    try {
      await deleteProject(id);
      console.log("Project successfully deleted");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false); // Desactivar loader de borrado
      setShowDeleteModal(false); // Cerrar el modal
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
          createdAt,
        },
      },
    });
  };

  return (
    <article className="flex flex-col justify-between bg-white rounded-lg shadow-md mb-4 dark:bg-[#333333]">
      <div>
        {/* Header */}
        <div className="flex flex-col items-start justify-between my-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-start gap-1">
              <h2
                className="text-3xl font-semibold text-gray-800 px-4 hover:underline cursor-pointer dark:text-white"
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
                <h3 onClick={()=> navigate(authorProfileLink)} className="text-md font-mono text-gray-500 hover:underline cursor-pointer dark:text-gray-300 ">
                  {authorName}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start justify-center ">
              <a
                className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456] dark:text-gray-50 dark:hover:text-[#8293ff]"
                href={linkRepo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-lg" />
                Repositorie
              </a>

              {linkDemo && (
                <a
                  className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456] dark:text-gray-50 dark:hover:text-[#8293ff]"
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

        <hr className="border-t w-full border-gray-200 my-2 dark:border-[#404040]" />
        {/* Renderizar la descripción en formato Markdown */}
        <div
          className="prose prose-sm w-full max-w-none text-gray-600 p-4 mb-4 cursor-pointer dark:text-gray-300 dark:bg-[#333333] dark:prose-invert"
          onClick={handleViewDetails}
        >
          <ReactMarkdown>{`${description.slice(0, 150)}...`}</ReactMarkdown>
          {description.length > 100 && (
            <button className="text-blue-500 hover:underline mt-2 cursor-pointer dark:text-blue-400 ">
              Ver más
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col justify-between items-start text-sm text-gray-500 dark:text-gray-300">
        <hr className="border-t w-full border-gray-200 dark:border-[#404040]" />
        <div className="flex items-center justify-between w-full p-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="flex text-gray-500 hover:text-blue-700 transition duration-300 cursor-pointer dark:text-gray-300 dark:hover:text-blue-400"
          >
            {isLoading ? (
              <NewLoader size="18" color="#3B82F6" h="h-auto" /> // Loader para el like
            ) : isLiked ? (
              <AiFillLike className="text-xl text-blue-700 dark:text-blue-400" />
            ) : (
              <AiOutlineLike className="text-xl" />
            )}
            {!isLoading && <span className="ml-1">{likeCount}</span>} {/* Mostrar contador solo si no está cargando */}
          </button>
          <div className="flex items-center justify-between gap-2">
            {user && user.uid === authorId && (
              <div className="flex items-center gap-2">
                <RiEditLine
                  onClick={handleEdit}
                  className="text-xl text-gray-500 cursor-pointer hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400"
                />
                <LuEraser
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xl text-gray-500 cursor-pointer hover:text-red-700 dark:text-gray-300 dark:hover:text-red-400"
                />
              </div>
            )}
            <span className="text-gray-500 dark:text-gray-300">{formattedDate}</span>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteModal
          project={{ id, title }}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </article>
  );
};

export default ProjectCard;
