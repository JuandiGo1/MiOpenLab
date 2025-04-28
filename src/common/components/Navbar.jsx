import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";

const Navbar = ({ children }) => {
  const { user } = useAuth();
  const profileImage = user.photoURL || defaultAvatar;

  return (
    <div className="flex min-h-screen bg-[#EAEOD5]">
      <nav className="flex flex-1 flex-col items-center justify-center bg-[#22333B] text-white p-4 shadow-md">
        <div className="flex items-center justify-start gap-2">
          <h1>¡Hola, {user.displayName || "Usuario"}!</h1>
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <ul className="navbar__links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <main className="flex-2">{children}</main>
    </div>
  );
};

export default Navbar;
