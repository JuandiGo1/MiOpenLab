import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { useNavigate } from "react-router-dom";
import { NewLoader } from "../../common/components/Loader";
import defaultBanner from "../../assets/defaultBanner.jpg";
import { FaEdit } from "react-icons/fa";

const EditProfile = () => {
  const {
    user,
    updateName,
    updateProfilePic,
    updateUserProfile,
    updateBannerPic,
  } = useAuth();
  const [name, setName] = useState(user.displayName);
  const [photo, setPhoto] = useState(user?.photoURL || defaultAvatar);
  const [photoFile, setPhotoFile] = useState(null);
  const [banner, setBanner] = useState(user?.bannerURL || defaultBanner);
  const [bannerFile, setBannerFile] = useState(null);
  const [bio, setBio] = useState(user?.bio || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [msgInfo, setMsgInfo] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState(user?.location || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [github, setGithub] = useState(user?.github || "");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // archivo a subir
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result); // base64 solo para previsualización
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => setBanner(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMsgInfo("Updating...");

      const promises = [
        updateName(name),
        photoFile ? updateProfilePic(photoFile) : Promise.resolve(),
        bannerFile ? updateBannerPic(bannerFile) : Promise.resolve(),
        updateUserProfile({
          bio,
          headline,
          skills,
          location,
          linkedin,
          github,
        }),
      ];

      await Promise.all(promises);

      setMsgInfo("Succesfully!");
      navigate(`/profile/${user.username}`);
    } catch (error) {
      setMsgInfo(error.message);
    } finally {
      setIsLoading(false); // Desactivar loader
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-5 bg-gray-100 dark:bg-[#181818]">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md dark:bg-[#333]">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-2">
            {/* Banner */}
            <div className="flex flex-col items-center mb-4">
              <label
                htmlFor="banner"
                className="relative w-full h-32 cursor-pointer group"
              >
                <img
                  src={banner}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultBanner;
                  }}
                  alt="Banner"
                  className="w-full h-32 object-cover rounded-lg mb-2 transition duration-200 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaEdit className="text-3xl text-white" />
                </div>
                <input
                  id="banner"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-4">
              <label
                htmlFor="photo"
                className="relative w-24 h-24 cursor-pointer group"
              >
                <img
                  src={photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-2 transition duration-200 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaEdit className="text-2xl text-white" />
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isLoading}
                />
              </label>
            </div>
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
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* Titular */}
          <div className="mb-4">
            <label
              htmlFor="headline"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Headline
            </label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Aptitudes */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 dark:text-gray-100">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
                placeholder="Add a skill"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={isLoading}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold dark:bg-blue-900 dark:text-blue-200 flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-red-500 hover:text-red-700"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              disabled={isLoading}
            />
          </div>

          {/* LinkedIn */}
          <div className="mb-4">
            <label
              htmlFor="linkedin"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              placeholder="https://linkedin.com/in/usuario"
              disabled={isLoading}
            />
          </div>

          {/* GitHub */}
          <div className="mb-4">
            <label
              htmlFor="github"
              className="block text-gray-700 font-bold mb-2 dark:text-gray-100"
            >
              GitHub
            </label>
            <input
              id="github"
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-[#333] dark:text-white dark:border-gray-500"
              placeholder="https://github.com/usuario"
              disabled={isLoading}
            />
          </div>

          {/* Botón de guardar */}
          <button
            type="submit"
            className="w-full bg-[#c9965b] text-white px-4 py-2 rounded-lg hover:bg-[#e29d4e] transition duration-300 ease-in-out cursor-pointer dark:bg-[#5858FA] dark:hover:bg-[#4343e8]"
            disabled={isLoading}
          >
            {isLoading ? (
              <NewLoader size="20" color="white" h="h-auto" />
            ) : (
              "Save Changes"
            )}
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
