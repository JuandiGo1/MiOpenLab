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
        read ? "bg-white dark:bg-[#181818]/90" : "bg-[#e2f0f5] dark:bg-[#444444]"
      }`}
    >
      <div className="flex items-center justify-start mb-2">
        <div className="relative">
          <img
            src={fromPhoto || defaultAvatar}
            alt={`${fromUsername}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full dark:bg-blue-400">
            <AiFillLike />
          </span>
        </div>
        <div className="flex gap-1 ml-2">
          <span className="font-bold dark:text-white">{fromUsername} </span>
          <span className="text-gray-600 dark:text-gray-200">
            {" "}
            liked your project{" "}
            <strong>
              <i>{postTitle}</i>
            </strong>
          </span>
        </div>
      </div>
      <p className="flex justify-end text-xs text-gray-400 mt-2 dark:text-gray-300">{formattedDate}</p>
    </div>
  ) : (
    <div
      className={`p-4 rounded-xl shadow-md w-full ${
        read ? "bg-white dark:bg-[#181818]/90" : "bg-[#e2f0f5] dark:bg-[#444444]"
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
        <div className="flex gap-1 ml-2">
          <span className="font-bold dark:text-white">{fromUsername}</span>
          <span className="text-gray-600 dark:text-gray-200">is following you </span>
        </div>
      </div>
      <p className="flex justify-end text-xs text-gray-400 mt-2 dark:text-gray-200">{formattedDate}</p>
    </div>
  );
};

export default NotificationItem;
