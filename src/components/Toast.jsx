import React from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = { success: CheckCircle, error: AlertCircle, info: Info };

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon size={16} style={{ flexShrink: 0, color: t.type === 'success' ? 'var(--success)' : t.type === 'error' ? 'var(--danger)' : 'var(--info)' }} />
            <span style={{ fontSize: '13px' }}>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}