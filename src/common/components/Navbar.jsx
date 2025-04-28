import { useAuth } from "../../auth/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { BiHomeAlt2 } from "react-icons/bi";
import { RiUser5Line,RiLogoutCircleLine  } from "react-icons/ri";
import { TiBookmark } from "react-icons/ti";

const Navbar = ({ children }) => {
  const { logout, user } = useAuth();
  const profileImage = user.photoURL ? user.photoURL : defaultAvatar;
  const navigate = useNavigate();

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
    <div className="flex min-h-screen bg-[#EAE0D5]">
      <nav className="flex flex-1 flex-col items-center justify-between bg-[#1c2930] text-white p-6 shadow-md">
        <div className="flex flex-col items-start justify-between w-full gap-10">
          <div className="flex items-center justify-start gap-2 mb-3">
            <img
              src={profileImage}
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-bold text-xl">
              {user ? user.displayName : "Usuario"}
            </h1>
          </div>
          <ul className="flex flex-col justify-start gap-7 text-lg">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#FFD700] flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <BiHomeAlt2 className="text-xl" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#FFD700] flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <RiUser5Line className="text-xl" />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#FFD700] flex items-center gap-2"
                    : "flex items-center gap-2"
                }
              >
                <TiBookmark className="text-xl" />
                Favorites
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-start w-full ">
          <button
            onClick={handleLogout}
            className="flex items-center justify-start gap-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            <RiLogoutCircleLine className="text-xl" />
            Logout
          </button>
        </div>
      </nav>
      <main className="flex-6">{children}</main>
    </div>
  );
};

export default Navbar;
