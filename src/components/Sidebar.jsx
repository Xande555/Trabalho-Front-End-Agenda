import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, CheckSquare, Bell, Tag, Settings, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendario', icon: Calendar, label: 'Calendário' },
  { to: '/dia', icon: Clock, label: 'Visão do Dia' },
  { to: '/tarefas', icon: CheckSquare, label: 'Tarefas' },
  { to: '/notificacoes', icon: Bell, label: 'Notificações', badge: true },
  { to: '/categorias', icon: Tag, label: 'Categorias' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function Sidebar() {
  const { unreadCount } = useApp();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Agenda</h1>
        <p>Organize seu tempo</p>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Menu</div>
        {links.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <Icon size={17} />
            {label}
            {badge && unreadCount > 0 && (
              <span style={{
                marginLeft: 'auto', background: '#f87171',
                color: 'white', borderRadius: '99px',
                fontSize: '10px', fontWeight: '600',
                padding: '1px 6px', minWidth: '18px', textAlign: 'center'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div style={{ fontSize: '11px', color: 'var(--text3)', padding: '8px' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </aside>
  );
}