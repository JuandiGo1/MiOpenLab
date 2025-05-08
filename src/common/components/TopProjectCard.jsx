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
      className="flex flex-col gap-1 bg-gray-50 border-1 border-[#24363f] rounded-xl shadow-md  hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
    >
      <div className="flex flex-col bg-[#24363f] rounded-t-lg  items-start p-4 gap-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {authorUsername ? (
          <p className="text-sm text-gray-100">@{authorUsername}</p>
        ) : (
          <p className="text-sm text-gray-100">{authorName}</p>
        )}
      </div>


      <div className="text-sm text-gray-600 mt-1 px-4 py-2">
        <ReactMarkdown>{truncatedDescription}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TopProjectCard;
