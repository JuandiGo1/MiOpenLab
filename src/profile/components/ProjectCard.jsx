import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { FaGithub } from "react-icons/fa";
import { MdDatasetLinked } from "react-icons/md";

//import { toggleLike } from "../services/projectService";

const ProjectCard = ({
  title,
  description,
  likes,
  authorName,
  authorPhoto,
  createdAt,
  linkRepo,
  linkDemo,
}) => {
  const [isLiked, setIsLiked] = useState(false); // Estado para rastrear si se ha dado "like"
  const [likeCount, setLikeCount] = useState(likes);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const authorAvatar = authorPhoto ? authorPhoto : defaultAvatar;

  // Formatear fecha
  const formattedDate = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked); // Alternar el estado de "like"
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription); // Alternar entre mostrar la descripción completa o truncada
  };

  return (
    <article className="flex flex-col justify-between bg-white rounded-lg shadow-md  mb-4">
      <div>
        <div className="flex flex-col items-start justify-between my-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-start gap-1">
              <h2 className="text-3xl font-semibold text-gray-800 px-4">
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
                href={linkDemo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="text-lg" />
                Repositorie
              </a>
              {linkDemo && (
                <a
                  className="flex items-center justify-start text-lg gap-1 font-mono text-gray-800 px-5 hover:text-[#ce9456]"
                  href={linkRepo}
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
        <div className="prose prose-sm text-gray-600 p-4 mb-4">
          <ReactMarkdown>
            {showFullDescription
              ? description
              : `${description.slice(0, 150)}...`}
          </ReactMarkdown>
          {description.length > 100 && (
            <button
              onClick={toggleDescription}
              className="text-blue-500 hover:underline mt-2 cursor-pointer"
            >
              {showFullDescription ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>

      {/* Botón de "like" y fecha de creación del proyecto */}
      <div className="flex flex-col justify-between items-start text-sm text-gray-500">
        <hr className="border-t w-full border-gray-200 " />
        <button
          onClick={handleLike}
          className="flex text-blue-500 hover:text-blue-700 transition duration-300 cursor-pointer p-4"
        >
          {isLiked ? (
            <AiFillLike className="text-xl" />
          ) : (
            <AiOutlineLike className="text-xl" />
          )}
          {likes}
        </button>
        <span className="text-red-700">{formattedDate}</span>
      </div>
    </article>
  );
};

export default ProjectCard;
