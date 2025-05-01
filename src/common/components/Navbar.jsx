import { useAuth } from "../../auth/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { BiHomeAlt2 } from "react-icons/bi";
import { RiUser5Line, RiLogoutCircleLine } from "react-icons/ri";
import { TiBookmark } from "react-icons/ti";

const Navbar = ({ children }) => {
  const { logout, user } = useAuth();
  const profileImage = user?.photoURL || defaultAvatar;
   console.log(user.photoURL)
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
    <div className="flex min-h-screen ">
      <nav className="flex  flex-col items-center justify-between bg-[#1c2930] text-white p-6 shadow-md w-64 h-screen fixed">
        <div className="flex flex-col items-start justify-between w-full gap-10">
          <div className="flex items-center justify-start gap-2 mb-3">
            <img
              src={profileImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-bold text-xl">
              {user ? user.displayName : "¡Join Us today!"}
            </h1>
          </div>
          <ul className="flex flex-col justify-start gap-7 text-lg w-full">
            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#EAE0D5]/40 pl-2 py-1 rounded-xl w-full flex items-center gap-2"
                    : "flex items-center gap-2 pl-2"
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
                    ? "bg-[#EAE0D5]/40 pl-2 py-1 rounded-xl w-full flex items-center gap-2"
                    : "flex items-center gap-2 pl-2"
                }
              >
                <RiUser5Line className="text-xl" />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile/newproject"
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#EAE0D5]/40 pl-2 py-1 rounded-xl w-full flex items-center gap-2"
                    : "flex items-center gap-2 pl-2"
                }
              >
                <TiBookmark className="text-xl" />
                Favorites
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-start w-full ">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-start gap-2  text-white px-4 py-2 rounded-xl hover:bg-[#806248]/10 cursor-pointer"
            >
              <RiLogoutCircleLine className="text-xl" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col justify-between gap-2">
              <NavLink
                to="/"
                className="flex items-center gap-2 bg-[#a86428] text-white text-bold text-xl px-3 py-2 rounded-xl"
              >
                Sing In
              </NavLink>

              <NavLink
                to="/"
                className="flex items-center gap-2 bg-[#806248] text-white text-bold text-xl px-3 py-2 rounded-xl"
              >
                Sing Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-1 ml-64 overflow-y-auto ">{children}</main>
    </div>
  );
};

export default Navbar;
