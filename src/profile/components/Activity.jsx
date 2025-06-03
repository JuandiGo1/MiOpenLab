import { useEffect, useState } from "react";
import { getUserActivity } from "../../auth/services/userService";
import { FaHeart, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../../auth/hooks/useAuth";

const activityIcons = {
  like: <FaHeart className="text-red-500" />,
  follow: <FaUserPlus className="text-blue-500" />,
};

const activityMessages = (item) => {
  switch (item.type) {
    case "like":
      return (
        <a href={`/project/${item.postId}`} className="hover:underline">
          You liked the project{" "}
          <span className="font-semibold">{item.postTitle || "a project"}</span>
        </a>
      );
    case "follow":
      return (
        <a href={`/profile/${item.targetUsername}`} className="hover:underline">
          You followed <span className="font-semibold">@{item.targetUsername || "someone"}</span>
        </a>
      );
    default:
      return "You did something!";
  }
};

const Activity = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const data = await getUserActivity(user.uid);
        console.log("Activity data:", data);
        setHistory(data.reverse()); // Más reciente primero
      } catch (e) {
        setHistory([]);
        console.error("Error fetching activity:", e);
      }
      setLoading(false);
    };
    if (user.uid) fetchActivity();
  }, [user.uid]);

  if (loading) return <div className="text-center py-8">Loading activity...</div>;

  if (!history.length)
    return <div className="text-center py-8 text-gray-500">No activity yet.</div>;

  return (
    <div className="space-y-4">
      {history.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 bg-white dark:bg-[#222] rounded-lg shadow p-4"
        >
          <div>{activityIcons[item.type] || null}</div>
          <div className="flex-1">
            <div className="text-gray-800 dark:text-gray-100">{activityMessages(item)}</div>
            <div className="text-xs text-gray-400 mt-1">
              {item.date ? new Date(item.date).toLocaleString() : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Activity;