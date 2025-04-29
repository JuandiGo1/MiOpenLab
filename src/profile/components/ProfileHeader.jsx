import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profileImage = user?.photoURL || defaultAvatar;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">33 posts</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-[#c7a277] hover:bg-[#855c2d] text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Edit Profile
        </button>
        <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
          Share
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
