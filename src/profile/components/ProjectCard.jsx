import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AiOutlineLike, AiFillLike, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useAuth } from "../../auth/hooks/useAuth";
import { FaGithub } from "react-icons/fa";
import { MdDatasetLinked } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import { LuEraser } from "react-icons/lu";
import DeleteModal from "../../common/components/DeleteModal";
import {
  deleteProject,
} from "../../profile/services/projectService";
import { getProjectCommentsCount } from "../../common/services/commentService";
import { formatDate } from "../../utils/dateFormatter";
import {
  likePost,
  unlikePost,
  getUserProfile,
  addToFavorites,
  removeFromFavorites,
} from "../../auth/services/userService";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ProjectCard = ({
  id,
  title,
  description,
  likes,
  authorId,
  createdAt,
  linkRepo,
  linkDemo,
  images,
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [authorProfileLink, setAuthorProfileLink] = useState("");
  const [authorProfile, setAuthorProfile] = useState(null);
  const [isFavoriteAnimating, setIsFavoriteAnimating] = useState(false);
  const mainImage = images && images.length > 0 ? images[0] : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorProfileLink = async () => {
      try {
        const profile = await getUserProfile(authorId);
        setAuthorProfile(profile);
        const username = profile?.username || "";

        setAuthorProfileLink(`/profile/${username}`);
      } catch (error) {
        console.error("Error fetching author profile link:", error);
      }
    };

    const fetchCommentCount = async () => {
      try {
        const count = await getProjectCommentsCount(id);
        setCommentCount(count);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    const fetchInitialStates = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setIsLiked(userProfile?.likedProjects?.includes(id) || false);
        setIsFavorite(userProfile?.favorites?.includes(id) || false);
      }
    };

    fetchAuthorProfileLink();
    fetchCommentCount();
    fetchInitialStates();
  }, [authorId, id, user]);

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
        // await removeLike(id, user.uid); // REMOVIDO: ya no es necesario
      } else {
        // Dar like
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
        await likePost(user.uid, id);
        // await addLike(id, user.uid); // REMOVIDO: ya no es necesario
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

  const handleFavorite = async () => {
    if (!user || isLoading) return;

    // Optimistic update
    setIsFavorite((prev) => !prev);
    setIsFavoriteAnimating(true);

    try {
      if (isFavorite) {
        await removeFromFavorites(user.uid, id);
      } else {
        await addToFavorites(user.uid, id);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      // Revert on error
      setIsFavorite((prev) => !prev);
    } finally {
      setIsLoading(false);
      // Reset animation after a short delay
      setTimeout(() => {
        setIsFavoriteAnimating(false);
      }, 300);
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
          authorName: authorProfile?.displayName || "Unknown Author",
          authorPhoto: authorProfile?.photoURL || defaultAvatar,
          createdAt,
        },
      },
    });
  };

  // CSS para la animación de destello
  const starAnimation = isFavoriteAnimating
    ? "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
    : "";

  return (
    <article className="flex flex-col justify-between bg-white rounded-lg shadow-md mb-4 dark:bg-[#333333]">
      <div>
        {/* Header */}
        <div className="flex flex-col items-start justify-between my-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-start gap-1">
              <h2
                className="text-3xl font-semibold text-gray-800 px-4 hover:underline cursor-pointer dark:text-white scalable-text"
                onClick={handleViewDetails}
              >
                {title}
              </h2>

              <div className="flex items-center justify-start gap-1 px-4 ">
                <img
                  src={authorProfile?.photoURL || defaultAvatar}
                  alt={`${authorProfile?.displayName}'s avatar`}
                  className="size-6 rounded-full object-cover"
                  loading="lazy"
                />
                <h3
                  onClick={() => navigate(authorProfileLink)}
                  className="text-md font-mono text-gray-500 hover:underline cursor-pointer dark:text-gray-300 scalable-text"
                >
                  {authorProfile?.displayName}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-start justify-center ">
              <a
                className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456] dark:text-gray-50 dark:hover:text-[#8293ff] scalable-text"
                href={linkRepo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-lg" />
                <p className="hidden sm:flex ">Repositorie</p>
              </a>

              {linkDemo && (
                <a
                  className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456] dark:text-gray-50 dark:hover:text-[#8293ff] scalable-text"
                  href={linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdDatasetLinked className="text-lg" />
                  <p className="hidden sm:flex ">Link Demo</p>
                </a>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t w-full border-gray-200 my-2 dark:border-[#404040]" />
        {/* Renderizar la descripción en formato Markdown */}
        <div
          className="prose prose-sm w-full max-w-none text-gray-600 p-4 mb-4 cursor-pointer dark:text-gray-300 dark:bg-[#333333] dark:prose-invert scalable-text"
          onClick={handleViewDetails}
        >
          <ReactMarkdown>{`${description.slice(0, 150)}...`}</ReactMarkdown>
          {description.length > 100 && (

            <button className="text-blue-500 hover:underline mt-2 cursor-pointer dark:text-blue-400 ">
              See more
            </button>
          )}
        </div>
      </div>

      {mainImage && (
        <PhotoProvider>
          <PhotoView src={mainImage}>
            <img
              src={mainImage}
              alt={title}
              className="w-full h-50 object-cover rounded-t-lg cursor-pointer"
              loading="lazy"
            />
          </PhotoView>
        </PhotoProvider>
      )}

      {/* Footer */}
      <div className="flex flex-col justify-between items-start text-sm text-gray-500 dark:text-gray-300">
        <hr className="border-t w-full border-gray-200 dark:border-[#404040]" />
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-700 transition duration-300 cursor-pointer dark:text-gray-300 dark:hover:text-blue-400"
            >
              {isLiked ? (
                <AiFillLike className="text-xl text-blue-700" />
              ) : (
                <AiOutlineLike className="text-xl" />
              )}
              {likeCount}
            </button>
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-700 transition duration-300 cursor-pointer dark:text-gray-300 dark:hover:text-blue-400"
            >
              <FaComment className="text-xl" />
              {commentCount}
            </button>
            {user && (
              <button
                onClick={handleFavorite}
                disabled={isLoading}
                className="relative flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition duration-300 cursor-pointer dark:text-gray-300 dark:hover:text-yellow-400"
              >
                {isFavorite ? (
                  <>
                    {isFavoriteAnimating && (
                      <span className={`${starAnimation} bg-yellow-500`} />
                    )}
                    <AiFillStar className="text-xl text-yellow-500 transform transition-transform duration-300 hover:scale-110" />
                  </>
                ) : (
                  <AiOutlineStar className="text-xl transform transition-transform duration-300 hover:scale-110" />
                )}
              </button>
            )}
          </div>

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
            <span className="text-gray-500 dark:text-gray-300 scalable-text">
              {formattedDate}
            </span>
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
