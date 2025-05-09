import { useEffect, useState } from "react";
import NotificationItem from "../components/NotificationItem";
import { getUserNotifications, markAllAsRead } from "../services/notiservice";
import Loader from "../../common/components/Loader";
import { useAuth } from "../../auth/hooks/useAuth";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await markAllAsRead();
      setNotifications((prev) =>
        prev.map((noti) => ({ ...noti, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} {...notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
