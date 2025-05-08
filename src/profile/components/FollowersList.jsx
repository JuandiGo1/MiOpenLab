import { useEffect, useState } from "react";
import {
  getUserFollowers,
  getUserProfile,
} from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followerIds = await getUserFollowers(userId);

        // Obtener la información de cada seguidor
        const followersData = await Promise.all(
          followerIds.map(async (followerId) => {
            const profile = await getUserProfile(followerId);
            return profile;
          })
        );

        setFollowers(followersData);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Followers ({followers.length})</h2>
      <ul className="flex flex-col gap-4">
        {followers.map((follower) => (
          <li key={follower.uid}>
            <div
              onClick={() => navigate(`/profile/${follower.username}`)}
              className="flex items-center bg-white rounded-3xl hover:-translate-y-1 transition-transform duration-200 gap-2 shadow-md cursor-pointer"
            >
              <img
                src={follower.photoURL || defaultAvatar}
                alt={`${follower.displayName}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span>{follower.displayName || "Unknown User"}</span>
                <span>@{follower.username || "@"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FollowersList;
