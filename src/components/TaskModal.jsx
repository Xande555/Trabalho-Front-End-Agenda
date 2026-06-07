import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TaskModal({ task, onClose }) {
  const { categories, addTask, updateTask } = useApp();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: '', priority: 'medium', categoryId: categories[0]?.id || '',
    dueDate: '', description: '',
    ...(task || {})
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) updateTask(task.id, form);
    else addTask(form);
    onClose();
  };

  const priorities = [
    { value: 'high', label: '🔴 Alta' },
    { value: 'medium', label: '🟡 Média' },
    { value: 'low', label: '🟢 Baixa' },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="O que precisa ser feito?" required autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select className="form-select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
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
            <label className="form-label">Prazo</label>
            <input type="date" className="form-input" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Detalhes da tarefa..." />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar' : 'Criar Tarefa'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}