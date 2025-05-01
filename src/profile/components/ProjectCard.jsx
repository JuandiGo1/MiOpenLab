import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
//import { toggleLike } from "../services/projectService";

const ProjectCard = ({ title, description, likes, authorName, authorPhoto, createdAt }) => {
  const [isLiked, setIsLiked] = useState(false); // Estado para rastrear si se ha dado "like"
  const [likeCount, setLikeCount] = useState(likes);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
        <div className="flex items-start justify-between">
          <div>
            <div>
              <img
                src={authorPhoto}
                alt="Project Thumbnail"
                className="w-12 h-12 rounded-lg m-4"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 p-4">{title}</h2>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 p-4">{authorName}</h2>
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
