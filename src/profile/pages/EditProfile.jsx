import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateName } = useAuth();
  const [name, setName] = useState(user.displayName);
  const [photo, setPhoto] = useState(user?.photoURL || defaultAvatar);
  const [msgInfo, setMsgInfo] = useState("");
  const navigate = useNavigate();

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
      setMsgInfo("Updating...");
      await updateName(name);
      //await updateProfilePic(photo);
      setMsgInfo("Succesfully!");
      navigate("/profile");
    } catch (error) {
      setMsgInfo(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Change Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Botón de guardar */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
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
