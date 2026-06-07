import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PRESET_COLORS = [
  '#7c6ff7','#60a5fa','#4ade80','#fb923c','#f472b6',
  '#f87171','#facc15','#34d399','#a78bfa','#38bdf8',
  '#ff6b6b','#c084fc','#2dd4bf','#fbbf24','#6ee7b7',
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function CategoryModal({ category, onClose }) {
  const { addCategory, updateCategory } = useApp();
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || PRESET_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const bg = hexToRgba(color, 0.14);
    if (isEdit) updateCategory(category.id, { name, color, bg });
    else addCategory({ name, color, bg });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '380px' }}>
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da categoria" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Cor</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {PRESET_COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', background: c,
                    cursor: 'pointer', border: color === c ? '2px solid white' : '2px solid transparent',
                    boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: '40px', height: '34px', borderRadius: '6px', border: '1px solid var(--border2)', background: 'var(--bg3)', cursor: 'pointer', padding: '2px' }} />
              <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Ou escolha uma cor personalizada</span>
            </div>
          </div>
          {/* Preview */}
          <div style={{ padding: '10px', background: hexToRgba(color, 0.14), borderRadius: 'var(--radius-sm)', border: `1px solid ${hexToRgba(color, 0.3)}`, marginBottom: '16px' }}>
            <span style={{ color, fontSize: '13px', fontWeight: '500' }}>{name || 'Prévia da categoria'}</span>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar' : 'Criar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Categorias() {
  const { categories, events, tasks, deleteCategory, setSelectedDate, getCategoryById } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const today = new Date().toISOString().split('T')[0];

  const handleGoToEvent = (ev) => {
    setSelectedDate(ev.date);
    navigate('/dia');
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Categorias</h2>
          <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>{categories.length} categorias · {events.length} eventos no total</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditCat(null); setShowModal(true); }}>
          <Plus size={14} /> Nova Categoria
        </button>
      </div>

      {/* Overview chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map(cat => {
          const count = events.filter(e => e.categoryId === cat.id).length;
          const taskCount = tasks.filter(t => t.categoryId === cat.id).length;
          return (
            <div key={cat.id} style={{
              padding: '6px 14px', borderRadius: '99px',
              background: cat.bg, border: `1px solid ${cat.color}33`,
              fontSize: '12px', color: cat.color, fontWeight: '500',
              cursor: 'pointer',
            }} onClick={() => { const el = document.getElementById(`cat-${cat.id}`); el?.scrollIntoView({ behavior: 'smooth' }); }}>
              {cat.name}
              <span style={{ opacity: 0.7, marginLeft: '6px' }}>{count} ev · {taskCount} tf</span>
            </div>
          );
        })}
      </div>

      {/* Category cards */}
      {categories.map(cat => {
        const catEvents = events.filter(e => e.categoryId === cat.id).sort((a,b) => a.date.localeCompare(b.date) || a.hour - b.hour);
        const catTasks = tasks.filter(t => t.categoryId === cat.id);
        const pendingTasks = catTasks.filter(t => !t.done).length;
        const isOpen = expanded[cat.id];

        return (
          <div key={cat.id} id={`cat-${cat.id}`} style={{ marginBottom: '12px' }}>
            <div style={{
              background: 'var(--bg2)', border: `1px solid ${isOpen ? cat.color + '44' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px', cursor: 'pointer',
                borderLeft: `4px solid ${cat.color}`,
              }} onClick={() => toggleExpand(cat.id)}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: cat.bg, border: `2px solid ${cat.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: cat.color }}>{cat.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '1px' }}>
                      {catEvents.length} evento{catEvents.length !== 1 ? 's' : ''} · {pendingTasks} tarefa{pendingTasks !== 1 ? 's' : ''} pendente{pendingTasks !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.stopPropagation(); setEditCat(cat); setShowModal(true); }}>
                    <Edit2 size={13} />
                  </button>
                  {!['work','personal','health','study','social'].includes(cat.id) && (
                    <button className="btn btn-danger btn-icon btn-sm" onClick={e => { e.stopPropagation(); deleteCategory(cat.id); }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                  {isOpen ? <ChevronDown size={16} style={{ color: 'var(--text3)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text3)' }} />}
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ borderTop: `1px solid var(--border)` }}>
                  {/* Events */}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} /> Eventos ({catEvents.length})
                    </div>
                    {catEvents.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'var(--text3)', fontStyle: 'italic' }}>Nenhum evento nesta categoria.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
                        {catEvents.map(ev => {
                          const isPast = ev.date < today;
                          const isToday = ev.date === today;
                          return (
                            <div
                              key={ev.id}
                              style={{
                                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg3)', border: `1px solid ${isToday ? cat.color + '55' : 'var(--border)'}`,
                                cursor: 'pointer', opacity: isPast ? 0.55 : 1,
                                transition: 'all 0.15s',
                              }}
                              onClick={() => handleGoToEvent(ev)}
                            >
                              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ev.title}
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: isToday ? cat.color : 'var(--text3)' }}>
                                  {isToday ? 'Hoje' : new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <Clock size={9} /> {String(ev.hour).padStart(2,'0')}h
                                </span>
                                {ev.location && <span style={{ fontSize: '11px', color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {ev.location}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tasks */}
                  {catTasks.length > 0 && (
                    <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', margin: '12px 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tarefas ({catTasks.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {catTasks.map(t => (
                          <span key={t.id} style={{
                            fontSize: '12px', padding: '3px 10px', borderRadius: '99px',
                            background: t.done ? 'var(--bg4)' : cat.bg,
                            color: t.done ? 'var(--text3)' : cat.color,
                            textDecoration: t.done ? 'line-through' : 'none',
                          }}>
                            {t.done ? '✓ ' : ''}{t.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {showModal && (
        <CategoryModal
          category={editCat}
          onClose={() => { setShowModal(false); setEditCat(null); }}
        />
      )}
    </div>
  );
}