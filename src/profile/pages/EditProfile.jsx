import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useNavigate } from "react-router-dom";
import { NewLoader } from "../../common/components/Loader";

const EditProfile = () => {
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user.displayName);
  const [photo, setPhoto] = useState(user?.photoURL || defaultAvatar);
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      //setMsgInfo("Updating...");
      await updateName(name);
      //await updateProfilePic(photo);
      setMsgInfo("Succesfully!");
      navigate(`/profile/${user.username}`);
    } catch (error) {
      setMsgInfo(error.message);
    } finally {
      setIsLoading(false); // Desactivar loader
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen bg-gray-100 dark:bg-[#181818]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md dark:bg-[#333]">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Foto de perfil */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={photo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            <label
              htmlFor="photo"
              className="bg-[#c9965b] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#e29d4e] transition duration-300 ease-in-out dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
            >
              Change Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isLoading}
            />
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* Botón de guardar */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#c9965b] text-white px-4 py-2 rounded-lg hover:bg-[#e29d4e] transition duration-300 ease-in-out cursor-pointer
            dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
          >
            {isLoading ? <NewLoader size="20" color="white" h="h-auto" /> : "Save Changes"}
          </button>
        </form>
      </div>
      {msgInfo && (
        <div className="mt-4 text-center text-green-600">{msgInfo}</div>
      )}
    </div>
  );
};

export default EditProfile;
