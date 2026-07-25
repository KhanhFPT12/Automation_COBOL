import { useEffect } from 'react';
import { useAppStore } from '../store';
import { subscribeToNotifications } from '../services/notificationSocket';

/** One application-wide notification subscription for both users and admins. */
export function NotificationSync() {
  const isLoggedIn = useAppStore((state) => state.session.isLoggedIn);
  const email = useAppStore((state) => state.session.email);
  const fetchNotifications = useAppStore((state) => state.fetchNotifications);

  useEffect(() => {
    if (!isLoggedIn || !email) return;

    void fetchNotifications();
    const unsubscribe = subscribeToNotifications(email, () => void fetchNotifications());
    const fallbackPolling = window.setInterval(() => void fetchNotifications(), 30000);

    return () => {
      window.clearInterval(fallbackPolling);
      unsubscribe();
    };
  }, [isLoggedIn, email, fetchNotifications]);

  return null;
}
