import { useEffect, useState } from "react";
import {
  getUserFollowers,
  getUserProfile,
} from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import FollowerCard from "./FollowerCard";

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
          <FollowerCard key={follower.uid} follower={follower} onClick={() => navigate(`/profile/${follower.username}`)} />
        ))}
      </ul>
    </>
  );
};

export default FollowersList;
