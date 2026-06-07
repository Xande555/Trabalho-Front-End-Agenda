import React, { useState, useMemo } from 'react';
import { Plus, Check, Trash2, Edit2, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TaskModal from './TaskModal';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const PRIORITY_COLORS = { high: 'var(--danger)', medium: 'var(--warn)', low: 'var(--success)' };
const PRIORITY_BG = { high: 'var(--danger-bg)', medium: 'var(--warn-bg)', low: 'var(--success-bg)' };
const PRIORITY_LABELS = { high: 'Alta', medium: 'Média', low: 'Baixa' };

export default function Tarefas() {
  const { tasks, categories, toggleTask, deleteTask, getCategoryById } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all | pending | done
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return tasks
      .filter(t => {
        if (filter === 'pending' && t.done) return false;
        if (filter === 'done' && !t.done) return false;
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      });
  }, [tasks, filter, priorityFilter, categoryFilter, search]);

  const pendingCount = tasks.filter(t => !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Tarefas</h2>
        <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
          <Plus size={14} /> Nova Tarefa
        </button>
      </div>

      {/* Progresso */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{doneCount} de {tasks.length} concluídas</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent2)' }}>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg3)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: '99px', transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--danger)' }}>🔴 {tasks.filter(t=>t.priority==='high'&&!t.done).length} alta</span>
          <span style={{ fontSize: '11px', color: 'var(--warn)' }}>🟡 {tasks.filter(t=>t.priority==='medium'&&!t.done).length} média</span>
          <span style={{ fontSize: '11px', color: 'var(--success)' }}>🟢 {tasks.filter(t=>t.priority==='low'&&!t.done).length} baixa</span>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: '180px', maxWidth: '280px' }}
          placeholder="Buscar tarefas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
          {[['all', 'Todas'], ['pending', `Pendentes (${pendingCount})`], ['done', `Concluídas (${doneCount})`]].map(([v, l]) => (
            <button key={v} className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-ghost'}`} style={{ border: 'none' }} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">Prioridade</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="all">Categoria</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text3)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontSize: '14px' }}>Nenhuma tarefa encontrada.</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }} onClick={() => { setEditTask(null); setShowModal(true); }}>
            <Plus size={12} /> Criar tarefa
          </button>
        </div>
      ) : (
        <div>
          {filtered.map(task => {
            const cat = getCategoryById(task.categoryId);
            return (
              <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                <div
                  className={`task-check ${task.done ? 'done' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  style={{ borderColor: task.done ? 'var(--success)' : PRIORITY_COLORS[task.priority] }}
                >
                  {task.done && <Check size={11} color="white" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => handleEdit(task)}>
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.description}
                    </div>
                  )}
                  <div className="task-meta">
                    <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: PRIORITY_BG[task.priority], color: PRIORITY_COLORS[task.priority] }}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                    {cat && (
                      <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '99px', background: cat.bg, color: cat.color }}>{cat.name}</span>
                    )}
                    {task.dueDate && (
                      <span className="task-tag">
                        📅 {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEdit(task)}><Edit2 size={13} /></button>
                  <button className="btn btn-danger btn-icon" onClick={() => deleteTask(task.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}