import { useEffect, useState } from "react";
import NotificationItem from "../components/NotificationItem";
import { getUserNotifications, markAllAsRead } from "../services/notiservice";
import TopProjectsBar from "../../common/components/TopProjects";
import { NewLoader } from "../../common/components/Loader";
import { useAuth } from "../../auth/hooks/useAuth";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState(false); // Estado para controlar el botón de "Marcar todo como leído"

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(user.uid);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAllAsRead = async () => {
    if (isMarkingRead) return; // Evitar múltiples clics
    setIsMarkingRead(true);
    try {
      await markAllAsRead(user.uid);
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    } finally {
      setIsMarkingRead(false);
    }
  };

  return (
    <div className="flex bg-gray-100 justify-between w-full min-h-screen dark:bg-[#181818]">
      <div className="flex-1 p-6 bg-gray-100 w-full min-h-screen dark:bg-[#181818]">
        <div className="flex justify-between items-center mb-6 gap-6">
          <h1 className="text-3xl font-bold text-[#1c2930] dark:text-white">Notifications</h1>
          {notifications.length > 0 && ( // Mostrar botón solo si hay notificaciones
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingRead || notifications.every(n => n.isRead)} // Deshabilitar si ya todas están leídas
              className="bg-[#bd9260] text-white px-4 py-2 rounded-lg hover:bg-[#ca9c6e] transition duration-150 ease-in-out 
              flex items-center justify-center min-w-[150px] min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed
              dark:bg-[#5858FA] dark:hover:bg-[#4343e8] dark:disabled:bg-[#6565fc]"
            >
              {isMarkingRead ? <NewLoader size="20" color="white" h="h-auto" /> : "Mark All as Read"}
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center pt-10"> {/* Contenedor para centrar el loader principal */}
            <NewLoader size="50" /> {/* MODIFICADO: Usar NewLoader para la carga inicial */}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 dark:text-gray-300">No notifications yet.</p>
        ) : (
          <div className="space-y-3"> {/* Usar space-y para espaciado entre items */}
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </div>
        )}
      </div>
      <TopProjectsBar />
    </div>
  );
};

export default NotificationsPage;
