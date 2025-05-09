import defaultAvatar from "../../assets/defaultAvatar.jpg";
import formatDate from "../../utils/dateFormatter";

const NotificationItem = ({
  type,
  isRead,
  createdAt,
  postTitle,
  fromUsername,
  fromPhoto,
}) => {
  const formattedDate = formatDate(createdAt);

  return type === "like" ? (
    <div
      className={`p-4 rounded-lg shadow-md ${
        isRead ? "bg-gray-200" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-start mb-2">
        <img
          src={fromPhoto || defaultAvatar}
          alt={`${fromUsername}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
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
      <p className="text-xs text-gray-400 mt-2">
        {formattedDate}
      </p>
    </div>
  ) : (
    <div
      className={`p-4 rounded-lg shadow-md ${
        isRead ? "bg-gray-200" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-start mb-2">
        <img
          src={fromPhoto || defaultAvatar}
          alt={`${fromUsername}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex gap-1 ml-1">
          <span className="font-bold">{fromUsername}</span>
          <span className="text-gray-600">is following you </span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {formattedDate}
      </p>
    </div>
  );
};

export default NotificationItem;
