import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import SearchBar from "../../common/components/SearchBar";

const ExplorePage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const profileImage = user?.photoURL || defaultAvatar;

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Cierre de sesión exitoso.");
      navigate("/");
    } catch (error) {
      console.error("Error cerrando sesión:", error.message);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center h-screen bg-[#EAE0D5]">
        <h1>¡Hola, {user ? user.displayName : "Usuario"}!</h1>
        <img
          src={profileImage}
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full object-cover"
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
        <p>Welcome to the Explore Page!</p>
      </div>
      <SearchBar></SearchBar>
    </div>
  );
};

export default ExplorePage;
