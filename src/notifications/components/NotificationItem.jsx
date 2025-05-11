import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { FaUserNinja } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import formatDate from "../../utils/dateFormatter";

const NotificationItem = ({
  type,
  read,
  createdAt,
  postTitle,
  fromUsername,
  fromPhoto,
}) => {
  const formattedDate = formatDate(createdAt);

  return type === "like" ? (
    <div
      className={`p-4 rounded-xl shadow-md w-full ${
        read ? "bg-white" : "bg-[#e2f0f5]"
      }`}
    >
      <div className="flex items-center justify-start mb-2">
        <div className="relative">
          <img
            src={fromPhoto || defaultAvatar}
            alt={`${fromUsername}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            <AiFillLike />
          </span>
        </div>
        <div className="flex gap-1 ml-1">
          <span className="font-bold">{fromUsername} </span>
          <span className="text-gray-600">
            {" "}
            liked your project{" "}
            <strong>
              <i>{postTitle}</i>
            </strong>
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>
    </div>
  ) : (
    <div
      className={`p-4 rounded-xl shadow-md w-full ${
        read ? "bg-white" : "bg-[#e2f0f5]"
      }`}
    >
      <div className="flex items-center justify-start mb-2">
        <div className="relative">
          <img
            src={fromPhoto || defaultAvatar}
            alt={`${fromUsername}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            <FaUserNinja  />
          </span>
        </div>
        <div className="flex gap-1 ml-1">
          <span className="font-bold">{fromUsername}</span>
          <span className="text-gray-600">is following you </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>
    </div>
  );
};

export default NotificationItem;
