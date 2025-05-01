import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import SearchBar from "../../common/components/SearchBar";
import CreatePostField from "../../common/components/CreatePostField";

const ExplorePage = () => {
  const { user } = useAuth();

  const profileImage = user?.photoURL || defaultAvatar;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center h-screen">
        <h1>¡Hola, {user ? user.displayName : "Usuario"}!</h1>
        <img
          src={profileImage}
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <p>Welcome to the Explore Page!</p>
      </div>
      <SearchBar></SearchBar>
    </div>
  );
};

export default ExplorePage;
