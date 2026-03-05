import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppNotification, fetchNotifications, markNotificationRead, markAllNotificationsRead, countUnreadNotifications } from "@/lib/notifications";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [notifs, count] = await Promise.all([
        fetchNotifications(user.uid),
        countUnreadNotifications(user.uid),
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    // Poll every 30s
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    await markAllNotificationsRead(user.uid);
    refresh();
  }, [user, refresh]);

  return { notifications, unreadCount, loading, refresh, markRead, markAllRead };
}
