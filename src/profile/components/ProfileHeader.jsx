import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import defaultBanner from "../../assets/defaultBanner.jpg";
import { followUser, unfollowUser } from "../../auth/services/userService";
import { ToastContainer, toast } from "react-toastify";
import { NewLoader } from "../../common/components/Loader";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { FaLinkedin, FaGithubSquare, FaGem } from "react-icons/fa";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import SettingsModal from "../../common/components/SettingsModal";
import { FiSettings } from "react-icons/fi";

const ProfileHeader = ({
  countPosts,
  currentUserUsername,
  currentUserUserUid,
  uid,
  photoURL,
  bannerURL,
  username,
  displayName,
  bio,
  headline,
  skills = [],
  location,
  linkedin,
  github,
}) => {
  const navigate = useNavigate();
  const [isFollowing, setFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowStatusLoading, setIsFollowStatusLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const profileImage = photoURL || defaultAvatar;
  const bannerImage = bannerURL || defaultBanner;
  const [hovering, setHovering] = useState(false);

  // Sincronizar isFollowing con currentUserFollows y uid
  useEffect(() => {
    if (currentUserUserUid && uid) {
      setIsFollowStatusLoading(true);
      const currentUserDocRef = doc(db, "users", currentUserUserUid);

      const unsubscribe = onSnapshot(
        currentUserDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const currentlyFollowing = userData.following || [];
            setFollow(currentlyFollowing.includes(uid));
          } else {
            setFollow(false);
            console.warn(`User document for ${currentUserUserUid} not found.`);
          }
          setIsFollowStatusLoading(false);
        },
        (error) => {
          console.error("Error listening to user's following status:", error);
          setFollow(false); // Default on error
          setIsFollowStatusLoading(false);
        }
      );

      return () => unsubscribe(); // Cleanup listener
    } else {
      // Not enough info to determine follow status
      setFollow(false);
      setIsFollowStatusLoading(false);
    }
  }, [currentUserUserUid, uid]);

  const handleFollow = async () => {
    if (isLoading || isFollowStatusLoading) return; // Prevent action if status is loading or another action is in progress
    setIsLoading(true);

    const previousIsFollowing = isFollowing; // Store state before action
    // Optimistic UI update
    setFollow(!previousIsFollowing);
    try {
      if (previousIsFollowing) {
        await unfollowUser(currentUserUserUid, uid);
      } else {
        await followUser(currentUserUserUid, uid);
      }
      //onSnapshot asegura que el estado se sincronice con la base de datos.
    } catch (error) {
      console.error("Error al actualizar el estado de seguimiento:", error);
      setFollow(previousIsFollowing); // Revert optimistic update on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${username}`
      );
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
    <div className="bg-white rounded-lg shadow-md mb-6 dark:bg-[#333333] overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 w-full">
        <PhotoProvider bannerVisible={false}>
          <PhotoView src={bannerImage}>
            <img
              src={bannerImage}
              alt="Banner"
              className="object-cover w-full h-full cursor-pointer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultBanner;
              }}
            />
          </PhotoView>
        </PhotoProvider>

        {/* Foto de perfil superpuesta */}
        <div className="absolute left-8 right-8 -bottom-12 flex items-center justify-between z-10 w-[calc(100%-4rem)]">
          {/* Foto de perfil */}
          <PhotoProvider bannerVisible={false}>
            <PhotoView src={profileImage}>
              <img
                src={profileImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                alt="Profile"
                className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg dark:border-[#333333] cursor-pointer"
              />
            </PhotoView>
          </PhotoProvider>

          {/* Botones */}
          <div className="flex space-x-2 mt-4">
            {currentUserUsername === username ? (
              <button
                onClick={() => navigate("/profile/edit")}
                className="bg-[#bd9260] hover:bg-[#ce9456]/80 transition duration-300 ease-in-out text-white px-4 py-2 rounded-lg cursor-pointer dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                disabled={isLoading}
                className={`${
                  isFollowing
                    ? "bg-gray-300 border-[#bd9260] text-gray-600 hover:bg-red-400 dark:text-gray-200 dark:bg-[#1c2930] dark:hover:bg-red-400"
                    : "bg-[#bd9260] text-white hover:bg-[#ce9456]/80 dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
                } transition duration-300 ease-in-out px-4 py-2 rounded-lg cursor-pointer`}
              >
                {isLoading ? (
                  <NewLoader
                    size="20"
                    color={isFollowing ? "#1c2930" : "white"}
                    h="h-auto"
                  />
                ) : isFollowing ? (
                  hovering ? (
                    "Unfollow"
                  ) : (
                    "Following"
                  )
                ) : (
                  "Follow"
                )}
              </button>
            )}
            <button
              onClick={handleCopyLink}
              className="bg-gray-200 text-gray-600 hover:bg-[#1c2930]/80 hover:text-white transition duration-300 ease-in-out px-4 py-2 rounded-lg cursor-pointer dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-[#1c2930] dark:hover:text-white"
            >
              Share
            </button>
            <ToastContainer />
          </div>
        </div>
      </div>
      {/* Info principal */}
      <div className="pt-14 px-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-2xl font-bold dark:text-white scalable-text">
                {displayName}
              </h1>

              {linkedin || github ? (
                <div className="flex space-x-4">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FaLinkedin className="text-3xl" />
                    </a>
                  )}
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200"
                    >
                      <FaGithubSquare className="text-3xl" />
                    </a>
                  )}
                </div>
              ) : null}
            </div>

            <p className="text-gray-600 dark:text-gray-200 scalable-text">@{username}</p>
            {headline && (
              <p className="text-gray-800 dark:text-gray-300 mt-1 scalable-text">
                {headline}
              </p>
            )}
            {location && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 scalable-text">
                {location}
              </p>
            )}
          </div>
        </div>
        {/* Descripción */}
        {bio && <p className="mt-4 text-gray-700 dark:text-gray-200 scalable-text">{bio}</p>}
        {/* Aptitudes */}
        {skills && skills.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#222] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <FaGem className="text-xl text-gray-700 dark:text-gray-200 mr-2" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white scalable-text">
                  Main skills
                </span>
                <div className="text-gray-700 dark:text-gray-200 text-sm mt-1">
                  {skills.map((skill, idx) => (
                    <span key={idx}>
                      {skill}
                      {idx < skills.length - 1 && (
                        <span className="mx-1">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Posts count */}
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm scalable-text">
          {countPosts} posts
        </p>
      </div>
      {/* Ajustes botón y modal */}
      {currentUserUserUid === uid && (
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold mt-2"
        >
          <FiSettings className="text-lg" />
          Ajustes
        </button>
      )}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default ProfileHeader;
