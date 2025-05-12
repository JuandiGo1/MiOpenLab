
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useNavigate } from "react-router-dom";

const FollowerCard = ({ follower }) => {
  const navigate = useNavigate();
  return (
    <li key={follower.uid}>
      <div
        onClick={() => navigate(`/profile/${follower.username}`)}
        className="flex items-center  hover:-translate-y-1 transition-transform duration-200 gap-2  cursor-pointer"
      >
        <img
          src={follower.photoURL || defaultAvatar}
          alt={`${follower.displayName}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-bold dark:text-gray-50">{follower.displayName || "Unknown User"}</span>
          <span className="font-mono dark:text-gray-200">@{follower.username || "@"}</span>
        </div>
      </div>
    </li>
  );
};

export default FollowerCard;
