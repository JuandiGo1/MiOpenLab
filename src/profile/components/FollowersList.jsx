import { Fragment, useEffect, useState } from "react";
import {
  getUserFollowers,
  getUserProfile,
} from "../../auth/services/userService";
import { useNavigate } from "react-router-dom";
import FollowerCard from "./FollowerCard";
import Loader from "../../common/components/Loader"

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Followers ({followers.length})</h2>
      {loading ? (
        <Loader />

      ) : followers.length === 0 ? (
        <p className="flex justify-center items-center w-full h-64 text-gray-500">No followers yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {followers.map((follower) => (
            <FollowerCard
              key={follower.uid}
              follower={follower}
              onClick={() => navigate(`/profile/${follower.username}`)}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default FollowersList;
