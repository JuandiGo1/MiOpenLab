import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const ExplorePage = () => {
  const { logout, user } = useAuth();
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
    <div>
      <h1>¡Hola, {user.displayName || "Usuario"}!</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
      <p>Welcome to the Explore Page!</p>
    </div>
  );
}

export default ExplorePage;