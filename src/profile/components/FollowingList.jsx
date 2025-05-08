import { useEffect, useState } from "react";
import { getUserFollowing, getUserProfile } from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import FollowerCard from "./FollowerCard";

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
          <FollowerCard key={followed.uid} follower={followed} onClick={() => navigate(`/profile/${followed.username}`)} />
        ))}
      </ul>
    </>
  );
};

export default FollowingList;