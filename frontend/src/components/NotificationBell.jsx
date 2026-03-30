import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../api';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    // Poll every 10 seconds for new alerts
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/mark_read/`);
            fetchNotifications();
        } catch (error) {}
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-brand-600 transition"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Notifications</span>
                        <button 
                            onClick={() => { setIsOpen(false); }}
                            className="text-xs text-gray-500 hover:text-gray-800"
                        >
                            Close
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => handleMarkRead(notif.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${!notif.is_read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <p className={`text-sm ${!notif.is_read ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        {new Date(notif.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}