import { useEffect, useState } from "react";
import {
  getUserFollowing,
  getUserProfile,
} from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import FollowerCard from "./FollowerCard";
import Loader from "../../common/components/Loader";

const FollowingList = ({ userId }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDarkMode(theme === "dark");
  }, []);  

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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching following:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Following ({following.length})</h2>
      {loading ? (
        <Loader color={!isDarkMode ? "#bd9260" : "#5858FA"} />
      ) : following.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-200">No following yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {following.map((followed) => (
            <FollowerCard
              key={followed.uid}
              follower={followed}
              onClick={() => navigate(`/profile/${followed.username}`)}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default FollowingList;
