import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { followUser, unfollowUser } from "../../auth/services/userService";
import { ToastContainer, toast } from "react-toastify";
import { NewLoader } from "../../common/components/Loader";

const ProfileHeader = ({
  countPosts,
  currentUserUsername,
  currentUserUserUid,
  currentUserFollows,
  uid,
  photoURL,
  username,
  displayName,
}) => {
  const navigate = useNavigate();
  const [isFollowing, setFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const profileImage = photoURL || defaultAvatar;

  // Sincronizar isFollowing con currentUserFollows y uid
  useEffect(() => {
    if (currentUserFollows?.includes(uid)) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [currentUserFollows, uid]);

  const handleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        // Dejar de seguir al usuario
        await unfollowUser(currentUserUserUid, uid);
        setFollow(false); // Actualizar el estado local
      } else {
        // Seguir al usuario
        await followUser(currentUserUserUid, uid); // Actualizar Firestore
        setFollow(true); // Actualizar el estado local
      }
    } catch (error) {
      console.error("Error al actualizar el estado de seguimiento:", error);
    } finally {
      setIsLoading(false); // Desactivar el loader
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/profile/${username}`);
      toast("✅ Profile link copied to clipboard!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Error on copy link to clipboard...", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error("Error copying link:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-[#333333]">
      <div className="flex items-center">
        <img
          src={profileImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-gray-600">@{username}</p>
          <p className="text-gray-600">{countPosts} posts</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        {currentUserUsername === username ? (
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-[#bd9260] hover:bg-[#ce9456]/80 transition duration-300 ease-in-out text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`${
              isFollowing
                ? "bg-gray-300 border-[#bd9260] text-gray-700 hover:bg-gray-400"
                : "bg-[#bd9260] text-white hover:bg-[#ce9456]/80"
            } transition duration-300 ease-in-out px-4 py-2 rounded-lg cursor-pointer`}
          >
            {isLoading ? (
              <NewLoader size="20" color={isFollowing ? "#1c2930" : "white"} h="h-auto" />
            ) : (
              isFollowing ? "Unfollow" : "Follow"
            )}
          </button>
        )}

        <button onClick={handleCopyLink} className="bg-gray-200 text-gray-600 hover:bg-[#1c2930]/80 hover:text-white transition duration-300 ease-in-out px-4 py-2 rounded-lg cursor-pointer">
          Share
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ProfileHeader;
