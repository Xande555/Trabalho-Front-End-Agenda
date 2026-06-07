import React, { useState } from 'react';
import { Plus, Calendar, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventModal from './EventModal';
import TaskModal from './TaskModal';

export default function Dashboard() {
  const { events, tasks, categories, getCategoryById, setSelectedDate } = useApp();
  const navigate = useNavigate();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === today).sort((a, b) => a.hour - b.hour);
  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);
  const highPriority = pendingTasks.filter(t => t.priority === 'high');

  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour)
    .slice(0, 5);

  const fmt = (d) => {
    if (d === today) return 'Hoje';
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const priorityColors = { high: 'var(--danger)', medium: 'var(--warn)', low: 'var(--success)' };
  const priorityLabels = { high: 'Alta', medium: 'Média', low: 'Baixa' };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
            Bom dia! 👋
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '2px' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" onClick={() => setShowEventModal(true)}>
            <Plus size={14} /> Evento
          </button>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={14} /> Tarefa
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="stat-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} /> Eventos hoje
          </div>
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{todayEvents.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckSquare size={13} /> Tarefas pendentes
          </div>
          <div className="stat-value" style={{ color: 'var(--warn)' }}>{pendingTasks.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={13} /> Concluídas
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{doneTasks.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} /> Alta prioridade
          </div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{highPriority.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Eventos de Hoje */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Eventos de Hoje</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedDate(today); navigate('/dia'); }}>
              Ver todos
            </button>
          </div>
          {todayEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '13px' }}>
              Nenhum evento hoje.<br />
              <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => setShowEventModal(true)}>
                <Plus size={12} /> Adicionar
              </button>
            </div>
          ) : todayEvents.map(ev => {
            const cat = getCategoryById(ev.categoryId);
            return (
              <div key={ev.id} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg3)', marginBottom: '8px' }}>
                <div style={{ width: '3px', borderRadius: '99px', background: cat?.color || '#888', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{String(ev.hour).padStart(2,'0')}:00 · {ev.duration}h{ev.location ? ` · ${ev.location}` : ''}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Próximos Eventos */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Próximos Eventos</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/calendario')}>Calendário</button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '13px' }}>Nenhum evento próximo.</div>
          ) : upcomingEvents.map(ev => {
            const cat = getCategoryById(ev.categoryId);
            return (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ background: cat?.bg || 'var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', textAlign: 'center', minWidth: '52px' }}>
                  <div style={{ fontSize: '10px', color: cat?.color || 'var(--text3)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {fmt(ev.date)}
                  </div>
                  <div style={{ fontSize: '12px', color: cat?.color, fontWeight: '500' }}>
                    {String(ev.hour).padStart(2,'0')}h
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                  {ev.location && <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{ev.location}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sistema de prioridade */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Tarefas Prioritárias</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tarefas')}>Ver todas</button>
          </div>
          {pendingTasks.slice(0, 4).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: '13px' }}>
              🎉 Todas as tarefas concluídas!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {pendingTasks.sort((a,b) => {
                const p = {high:0,medium:1,low:2};
                return p[a.priority] - p[b.priority];
              }).slice(0,4).map(task => {
                const cat = getCategoryById(task.categoryId);
                return (
                  <div key={task.id} style={{ display: 'flex', gap: '10px', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg3)', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: priorityColors[task.priority], flexShrink: 0, marginTop: '4px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{task.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                        {priorityLabels[task.priority]}
                        {cat && ` · ${cat.name}`}
                        {task.dueDate && ` · ${new Date(task.dueDate+'T00:00:00').toLocaleDateString('pt-BR')}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showEventModal && <EventModal defaultDate={today} onClose={() => setShowEventModal(false)} />}
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}
    </div>
  );
}