import { useState, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { BiHomeAlt2 } from "react-icons/bi";
import { RiUser5Line, RiLogoutCircleLine } from "react-icons/ri";
import { MdOutlineNotifications } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { getUnreadNotificationsCount } from "../../notifications/services/notiservice";
import ThemeSwitch from "./ThemeSwitch";

const Navbar = ({ children }) => {
    const { logout, user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const profileImage = user?.photoURL || defaultAvatar;
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await getUnreadNotificationsCount(user.uid);
                setUnreadCount(count);
            } catch (error) {
                console.error("Error fetching unread notifications count:", error);
            }
        };

        if (user) {
            fetchUnreadCount();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            console.log("Cierre de sesión exitoso.");
            navigate("/");
        } catch (error) {
            console.error("Error cerrando sesión:", error.message);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDarkMode(true);
        }
    }, []);

    const handleThemeChange = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="flex min-h-screen min-w-[320px]">
            {/* Mobile Header - Fixed at top */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#333333] shadow-md flex items-center h-16 px-4 min-w-[320px]">
                {!isMenuOpen && (
                    <button
                        onClick={toggleMenu}
                        className="p-2 bg-[#1c2930] text-white rounded-md shadow-sm dark:bg-gray-900 flex-shrink-0"
                    >
                        <HiMenu className="text-xl" />
                    </button>
                )}

                <div className={`${!isMenuOpen ? "ml-4" : ""} flex items-center h-10`}>
                    <span className="text-gray-800 dark:text-white text-lg font-semibold truncate">
                        MiOpenLab
                    </span>
                </div>
            </header>

            {/* Close Button - Separate when menu is open */}
            {isMenuOpen && (
                <button
                    onClick={toggleMenu}
                    className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#1c2930] text-white rounded-md shadow-sm dark:bg-gray-900"
                >
                    <HiX className="text-xl" />
                </button>
            )}

            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black opacity-50 z-40"
                    onClick={closeMenu}
                />
            )}

            {/* Sidebar Navigation */}
            <nav
                className={`
          flex flex-col items-center justify-between bg-[#1c2930] text-white p-4 lg:p-6 shadow-md 
          w-64 h-screen fixed z-50 transition-transform duration-300 ease-in-out dark:bg-gray-900
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="flex flex-col items-start justify-between w-full gap-6 lg:gap-10 pt-12 lg:pt-0">
                    {/* Profile Section */}
                    <div className="flex items-center justify-start gap-2 mb-3 w-full">
                        <img
                            src={profileImage || "/placeholder.svg"}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultAvatar;
                            }}
                            alt="Foto de perfil"
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <h1 className="text-sm lg:text-xl font-bold truncate">
                            {user ? user.displayName : "¡Join Us today!"}
                        </h1>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex flex-col justify-start gap-4 lg:gap-7 text-base lg:text-lg w-full">
                        <li>
                            <NavLink
                                to="/home"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#EAE0D5]/40 pl-2 py-2 rounded-xl w-full flex items-center gap-2"
                                        : "flex items-center gap-2 pl-2 py-2 hover:bg-[#EAE0D5]/20 rounded-xl transition-colors"
                                }
                            >
                                <BiHomeAlt2 className="text-lg lg:text-xl flex-shrink-0" />
                                <span className="truncate">Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={user ? `/profile/${user.username}` : `/`}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#EAE0D5]/40 pl-2 py-2 rounded-xl w-full flex items-center gap-2"
                                        : "flex items-center gap-2 pl-2 py-2 hover:bg-[#EAE0D5]/20 rounded-xl transition-colors"
                                }
                            >
                                <RiUser5Line className="text-lg lg:text-xl flex-shrink-0" />
                                <span className="truncate">Profile</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={user ? `/notifications` : `/`}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-[#EAE0D5]/40 pl-2 py-2 rounded-xl w-full flex items-center justify-between gap-2 relative"
                                        : "flex items-center gap-2 pl-2 py-2 justify-between relative hover:bg-[#EAE0D5]/20 rounded-xl transition-colors"
                                }
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <MdOutlineNotifications className="text-lg lg:text-xl flex-shrink-0" />
                                    <span className="truncate">Notifications</span>
                                </div>

                                {unreadCount > 0 && (
                                    <span className="bg-blue-400 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                                        {unreadCount}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                        {user && (
                            <li>
                                <NavLink
                                    to="/newproject"
                                    onClick={closeMenu}
                                    className="flex items-center justify-center text-center font-bold bg-[#bd9260] rounded-full gap-1 px-3 lg:px-4 py-2 lg:py-3 
                    hover:bg-[#ce9456]/80 transition duration-300 ease-in-out
                    dark:bg-[#5858FA] dark:text-white dark:hover:bg-[#4343e8] dark:hover:text-white"
                                >
                                    <span className="text-sm lg:text-base">New Project</span>
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Theme Switch */}
                    <div className="flex items-center justify-between w-full">
                        <ThemeSwitch checked={darkMode} onChange={handleThemeChange} />
                    </div>
                </div>

                {/* Bottom Section - Logout/Login */}
                <div className="flex items-start w-full">
                    {user ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                closeMenu();
                            }}
                            className="flex items-center justify-start gap-2 text-white px-2 lg:px-4 py-2 rounded-xl hover:bg-[#806248]/10 cursor-pointer w-full"
                        >
                            <RiLogoutCircleLine className="text-lg lg:text-xl flex-shrink-0" />
                            <span className="text-sm lg:text-base truncate">Logout</span>
                        </button>
                    ) : (
                        <div className="flex flex-col justify-between gap-3 lg:gap-5 w-full">
                            <NavLink
                                to="/"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 bg-[#e7dbce] hover:bg-[#ce9456]/80 hover:text-white transition duration-300 ease-in-out text-gray-900 font-bold text-sm lg:text-xl px-3 py-2 rounded-xl 
                dark:bg-[#4343e8] dark:text-white dark:hover:bg-[#5858FA] dark:hover:text-white"
                            >
                                Sign In
                            </NavLink>

                            <NavLink
                                to="/"
                                onClick={closeMenu}
                                className="flex items-center justify-center gap-2 bg-[#bd9260] hover:bg-[#ce9456] transition duration-300 ease-in-out text-white font-bold text-sm lg:text-xl px-3 py-2 rounded-xl 
                dark:bg-[#2838c9] dark:text-white dark:hover:bg-[#2e3ec9] dark:hover:text-white"
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                    ;
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 overflow-y-auto dark:bg-[#333333] pt-16 lg:pt-0 min-w-0">
                {children}
            </main>
        </div>
    );
};
export default Navbar;
