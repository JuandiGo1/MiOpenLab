import React from "react";

const ProjectCard = ({ image, title, description, likes, date }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{likes} likes</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default ProjectCard;