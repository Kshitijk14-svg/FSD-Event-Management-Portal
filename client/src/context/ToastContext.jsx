import React, { useState, useCallback } from 'react';
import { ToastContext } from './toastContextDef';
import '../components/Toast.css';

const TOAST_ICONS = {
  success: '✓',
  error: '!',
  info: 'ℹ',
};

/**
 * Toast Notification Provider
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', message = '', title = null, duration = 4000 }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast = {
        id,
        type,
        message,
        title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Notice' : 'Information'),
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, title = 'Success') => showToast({ type: 'success', message, title }),
    [showToast]
  );

  const error = useCallback(
    (message, title = 'Error') => showToast({ type: 'error', message, title }),
    [showToast]
  );

  const info = useCallback(
    (message, title = 'Information') => showToast({ type: 'info', message, title }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, removeToast }}>
      {children}
      {/* Toast Render Viewport */}
      <div className="toast-container" aria-live="polite" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`} role="alert">
            <div className="toast-icon">{TOAST_ICONS[t.type] || '•'}</div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-message">{t.message}</div>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
