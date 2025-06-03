import { FaUserNinja } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaCommentSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { formatDate } from "../../utils/dateFormatter";

const NotificationItem = ({
  type,
  read,
  createdAt,
  postTitle,
  fromUsername,
  fromPhoto,
  postId,
  extraInfo,
}) => {
  const navigate = useNavigate();
  const formattedDate = formatDate(createdAt);

  const handleClick = () => {
    if (postId) {
      navigate(`/project/${postId}`);
      if (extraInfo?.commentId) {
        // TODO: Implement scrolling to specific comment if needed
      }
    }
  };

  const renderNotificationContent = () => {
    switch (type) {
      case "like":
        return {
          icon: <AiFillLike />,
          iconBgColor: "bg-blue-500 dark:bg-blue-400",
          message: (
            <span className="text-gray-600 dark:text-gray-200">
              liked your project{" "}
              <strong>
                <i>{postTitle}</i>
              </strong>
            </span>
          ),
        };
      case "follow":
        return {
          icon: <FaUserNinja />,
          iconBgColor: "bg-green-500",
          message: (
            <span className="text-gray-600 dark:text-gray-200">
              is following you
            </span>
          ),
        };
      case "comment":
        return {
          icon: <FaComment />,
          iconBgColor: "bg-purple-500",
          message: (
            <span className="text-gray-600 dark:text-gray-200">
              commented on your project{" "}
              <strong>
                <i>{postTitle}</i>
              </strong>
              {extraInfo?.commentContent && (
                <p className="mt-1 text-sm italic">"{extraInfo.commentContent}"</p>
              )}
            </span>
          ),
        };
      case "comment_deleted":
        return {
          icon: <FaCommentSlash />,
          iconBgColor: "bg-red-500",
          message: (
            <span className="text-gray-600 dark:text-gray-200">
              deleted their comment on your project{" "}
              <strong>
                <i>{postTitle}</i>
              </strong>
              {extraInfo?.commentContent && (
                <p className="mt-1 text-sm italic">"{extraInfo.commentContent}"</p>
              )}
            </span>
          ),
        };
      default:
        return {
          icon: null,
          iconBgColor: "bg-gray-500",
          message: <span>New notification</span>,
        };
    }
  };

  const { icon, iconBgColor, message } = renderNotificationContent();

  return (
    <div
      className={`p-4 rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-[#222222] transition-colors ${
        read ? "bg-white dark:bg-[#181818]/90" : "bg-[#e2f0f5] dark:bg-[#444444]"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-start mb-2">
        <div className="relative">
          <img
            src={fromPhoto || defaultAvatar}
            alt={`${fromUsername}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${iconBgColor}`}
          >
            {icon}
          </span>
        </div>
        <div className="flex gap-1 ml-2">
          <span className="font-bold dark:text-white">{fromUsername}</span>
          {message}
        </div>
      </div>
      <p className="flex justify-end text-xs text-gray-400 mt-2 dark:text-gray-300">
        {formattedDate}
      </p>
    </div>
  );
};

export default NotificationItem;
