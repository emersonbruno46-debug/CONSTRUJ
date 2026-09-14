import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import './Toast.css';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className="toast-container"
      role="status"
      aria-live="polite"
    >
      <div className="toast-box">
        <CheckCircle2 size={20} className="toast-icon" aria-hidden="true" />
        <span className="toast-message">{message}</span>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
