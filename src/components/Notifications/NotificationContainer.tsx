import { useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { AppNotification } from '../../types';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-500/20 border-green-500/50 text-green-400',
  error: 'bg-red-500/20 border-red-500/50 text-red-400',
  warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
  info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

function NotificationItem({ notification }: { notification: AppNotification }) {
  const removeNotification = useAppStore((state) => state.removeNotification);
  const Icon = iconMap[notification.type];

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div
      className={`
        ${colorMap[notification.type]}
        p-4 rounded-lg border backdrop-blur-sm
        shadow-lg flex items-start gap-3
        animate-slide-in-right
        max-w-sm w-full
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium text-white">{notification.message}</p>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function NotificationContainer() {
  const notifications = useAppStore((state) => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
