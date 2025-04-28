import { useAuth } from "../../auth/hooks/useAuth";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { FaHome } from "react-icons/fa";

const Navbar = ({ children }) => {
  const { user } = useAuth();
  const profileImage = user.photoURL || defaultAvatar;

  return (
    <div className="flex min-h-screen bg-[#EAEOD5]">
      <nav className="flex flex-1 flex-col items-start justify-start bg-[#22333B] text-white p-5 shadow-md">
        <div className="flex items-center justify-start gap-2 mb-3">
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1>{user.displayName || "Usuario"}</h1>
        </div>
        <ul className="flex flex-col gap-3">
          <li>
            <a href="#home" className="flex items-center gap-2">
              <FaHome /> Home
            </a>
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
      <main className="flex-5">{children}</main>
    </div>
  );
};

export default Navbar;
