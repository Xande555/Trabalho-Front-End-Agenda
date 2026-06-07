import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DURATIONS = [0.5, 1, 1.5, 2, 3, 4, 6, 8];

export default function EventModal({ event, defaultDate, onClose }) {
  const { categories, addEvent, updateEvent } = useApp();
  const isEdit = !!event;

  const [form, setForm] = useState({
    title: '', date: defaultDate || new Date().toISOString().split('T')[0],
    hour: 9, duration: 1, categoryId: categories[0]?.id || '',
    description: '', location: '',
    ...(event || {})
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) updateEvent(event.id, form);
    else addEvent(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Editar Evento' : 'Novo Evento'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nome do evento" required autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Data</label>
              <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Hora</label>
              <select className="form-select" value={form.hour} onChange={e => set('hour', Number(e.target.value))}>
                {HOURS.map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Duração (h)</label>
              <select className="form-select" value={form.duration} onChange={e => set('duration', Number(e.target.value))}>
                {DURATIONS.map(d => <option key={d} value={d}>{d}h</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="form-select" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Local</label>
            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Onde será o evento?" />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detalhes adicionais..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar' : 'Criar Evento'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}