import { useEffect, useState } from "react";
import { getUserFollowing, getUserProfile } from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";

const FollowingList = ({ userId }) => {
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const followingIds = await getUserFollowing(userId);

        // Obtener la información de cada usuario seguido
        const followingData = await Promise.all(
          followingIds.map(async (followingId) => {
            const profile = await getUserProfile(followingId);
            return profile;
          })
        );

        setFollowing(followingData);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchFollowing();
  }, [userId]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Following ({following.length})</h2>
      <ul className="flex flex-col gap-4">
        {following.map((followed) => (
          <li key={followed.uid}>
            <div
              onClick={() => navigate(`/profile/${followed.username}`)}
              className="flex items-center bg-white rounded-3xl hover:-translate-y-1 transition-transform duration-200 gap-2 shadow-md cursor-pointer"
            >
              <img
                src={followed.photoURL || defaultAvatar}
                alt={`${followed.displayName}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span>{followed.displayName || "Unknown User"}</span>
                <span>@{followed.username || "@"}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FollowingList;