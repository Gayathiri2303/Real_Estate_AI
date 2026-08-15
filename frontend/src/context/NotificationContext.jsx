import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Only show useful notifications
  const notify = useCallback((message, type = 'info') => {
    // Block noisy / low-value messages
    const blocked = [
      'slideshow',
      'loaded',
      'refresh',
      'debug',
      'checking',
      'fetching'
    ];
    
    const lower = (message || '').toLowerCase();
    if (blocked.some(b => lower.includes(b))) {
      return; // silently ignore
    }

    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);

    setNotifications(prev => [
      { id: Date.now(), message, type, time: new Date() },
      ...prev.slice(0, 19)
    ]);
  }, []);

  const clearAll = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, notify, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}