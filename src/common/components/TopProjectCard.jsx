import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const TopProjectCard = ({
  id,
  title,
  authorName,
  authorUsername,
  description,
}) => {
  const navigate = useNavigate();

  // Limitar la descripción a 100 caracteres
  const truncatedDescription =
    description.length > 100
      ? description.substring(0, 100) + "...View more"
      : description;

  return (
    <div
      onClick={() => navigate(`/project/${id}`)}
      className="flex flex-col gap-1 bg-gray-50 border-1 border-[#24363f] rounded-xl 
      shadow-md hover:-translate-y-1 transition-transform duration-200 cursor-pointer
      dark:bg-[#1c2930] dark:border-[#24363f] dark:hover:bg-[#24363f] dark:hover:text-white
      w-full"
    >
      <div className="flex flex-col bg-[#24363f] rounded-t-lg items-start p-3 sm:p-4 gap-1">
        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 break-words scalable-text">
          {title}
        </h3>
        {authorUsername ? (
          <p className="text-xs sm:text-sm text-gray-100 truncate w-full scalable-text">
            @{authorUsername}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-gray-100 truncate w-full scalable-text">
            {authorName}
          </p>
        )}
      </div>

      <div className="text-xs sm:text-sm text-gray-600 mt-1 px-3 sm:px-4 py-2 dark:text-gray-200 scalable-text">
        <ReactMarkdown>{truncatedDescription}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TopProjectCard;
