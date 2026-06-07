import React from 'react';
import { Bell, BellOff, Trash2, CheckCheck, Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TYPE_ICONS = {
  event: Calendar,
  task: CheckSquare,
  alert: AlertCircle,
};

const TYPE_COLORS = {
  event: 'var(--accent)',
  task: 'var(--success)',
  alert: 'var(--warn)',
};

const TYPE_BG = {
  event: 'var(--accent-bg)',
  task: 'var(--success-bg)',
  alert: 'var(--warn-bg)',
};

const TYPE_LABELS = {
  event: 'Evento',
  task: 'Tarefa',
  alert: '⏰ Alerta',
};

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (min < 1) return 'agora mesmo';
  if (min < 60) return `${min}min atrás`;
  if (h < 24) return `${h}h atrás`;
  return `${d}d atrás`;
}

export default function Notificacoes() {
  const { notifications, markAllNotifRead, clearNotifications, unreadCount, settings, updateSettings } = useApp();

  const grouped = notifications.reduce((acc, n) => {
    const day = new Date(n.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(n);
    return acc;
  }, {});

  return (
    <div className="page-content" style={{ maxWidth: '720px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Notificações</h2>
          {unreadCount > 0 && (
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>
              {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Toggle notif on/off */}
          <button
            className={`btn btn-sm ${settings.notifEnabled ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => updateSettings({ notifEnabled: !settings.notifEnabled })}
            title={settings.notifEnabled ? 'Desativar alertas de proximidade' : 'Ativar alertas de proximidade'}
          >
            {settings.notifEnabled ? <Bell size={13} /> : <BellOff size={13} />}
            {settings.notifEnabled ? 'Alertas ativos' : 'Alertas desativados'}
          </button>
          {notifications.length > 0 && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={markAllNotifRead}>
                <CheckCheck size={13} /> Marcar todas lidas
              </button>
              <button className="btn btn-danger btn-sm" onClick={clearNotifications}>
                <Trash2 size={13} /> Limpar tudo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert settings banner */}
      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Bell size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '500' }}>Alertas de proximidade</div>
          <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
            Receba avisos quando um evento estiver prestes a começar
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text2)' }}>Avisar com</label>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px' }}
            value={settings.notifAdvanceMinutes}
            onChange={e => updateSettings({ notifAdvanceMinutes: Number(e.target.value) })}
            disabled={!settings.notifEnabled}
          >
            {[5, 10, 15, 30, 60].map(m => (
              <option key={m} value={m}>{m} min antes</option>
            ))}
          </select>
          <div
            style={{
              width: '40px', height: '22px', borderRadius: '99px',
              background: settings.notifEnabled ? 'var(--accent)' : 'var(--bg4)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              border: '1px solid var(--border2)',
            }}
            onClick={() => updateSettings({ notifEnabled: !settings.notifEnabled })}
          >
            <div style={{
              position: 'absolute', top: '2px',
              left: settings.notifEnabled ? '20px' : '2px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: 'white', transition: 'left 0.2s',
            }} />
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text3)' }}>
          <Bell size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <div style={{ fontSize: '14px' }}>Nenhuma notificação ainda.</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Os alertas de eventos aparecerão aqui.</div>
        </div>
      ) : (
        Object.entries(grouped).map(([day, items]) => (
          <div key={day} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: '500' }}>
              {day}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map(n => {
                const Icon = TYPE_ICONS[n.type] || Bell;
                return (
                  <div
                    key={n.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '12px 16px',
                      background: n.read ? 'var(--bg2)' : TYPE_BG[n.type] || 'var(--accent-bg)',
                      border: `1px solid ${n.read ? 'var(--border)' : (TYPE_COLORS[n.type] || 'var(--accent)') + '33'}`,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: TYPE_BG[n.type] || 'var(--accent-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${(TYPE_COLORS[n.type] || 'var(--accent)') + '44'}`,
                    }}>
                      <Icon size={14} style={{ color: TYPE_COLORS[n.type] || 'var(--accent)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{n.text}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: TYPE_BG[n.type], color: TYPE_COLORS[n.type] }}>
                          {TYPE_LABELS[n.type] || 'Notificação'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text3)' }}>
                          {timeAgo(n.time)}
                        </span>
                      </div>
                    </div>
                    {!n.read && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: TYPE_COLORS[n.type] || 'var(--accent)', flexShrink: 0, marginTop: '4px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}