import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

const ProjectCard = ({ title, description, likes, date }) => {
  const [isLiked, setIsLiked] = useState(false); // Estado para rastrear si se ha dado "like"
  const [likeCount, setLikeCount] = useState(likes); // Estado para el contador de likes

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1); // Disminuir el contador si se quita el "like"
    } else {
      setLikeCount(likeCount + 1); // Aumentar el contador si se da "like"
    }
    setIsLiked(!isLiked); // Alternar el estado de "like"
  };
  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md p-4 mb-4">
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {/* Renderizar la descripción en formato Markdown */}
        <div className="prose prose-sm text-gray-600 mb-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-col justify-between items-start text-sm text-gray-500">
        <hr className="border-t w-full border-gray-400 my-4" />
        <button
          onClick={handleLike}
          className="flex text-blue-500 hover:text-blue-700 transition duration-300 cursor-pointer"
        >
          {isLiked ? (
            <AiFillLike className="text-xl" />
          ) : (
            <AiOutlineLike className="text-xl" />
          )}
          {likes}
        </button>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
