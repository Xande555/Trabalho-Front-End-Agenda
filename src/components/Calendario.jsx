import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventModal from './EventModal';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function Calendario() {
  const { events, getCategoryById, setSelectedDate, selectedDate } = useApp();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [showModal, setShowModal] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);

  const { year, month } = viewDate;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () => setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  const goToday = () => { const d = new Date(); setViewDate({ year: d.getFullYear(), month: d.getMonth() }); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + 1 + i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, type: 'next' });
  }

  const getDateStr = (cell) => {
    if (cell.type === 'prev') {
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      return `${y}-${String(m+1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`;
    }
    if (cell.type === 'next') {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      return `${y}-${String(m+1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`;
    }
    return `${year}-${String(month+1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`;
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    navigate('/dia');
  };

  const handleDayDblClick = (dateStr) => {
    setClickedDate(dateStr);
    setShowModal(true);
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Calendário</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={goToday}>Hoje</button>
          <button className="btn btn-ghost btn-icon" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '150px', textAlign: 'center' }}>
            {MONTHS[month]} {year}
          </span>
          <button className="btn btn-ghost btn-icon" onClick={nextMonth}><ChevronRight size={16} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => { setClickedDate(today); setShowModal(true); }}>
            <Plus size={13} /> Evento
          </button>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '16px' }}>
        Clique em um dia para ver os eventos · Duplo clique para criar evento
      </p>

      <div className="calendar-grid" style={{ marginBottom: '8px' }}>
        {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
      </div>

      <div className="calendar-grid">
        {cells.map((cell, idx) => {
          const dateStr = getDateStr(cell);
          const dayEvents = events.filter(e => e.date === dateStr).sort((a,b) => a.hour - b.hour);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <div
              key={idx}
              className={`cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${cell.type !== 'current' ? 'other-month' : ''}`}
              onClick={() => handleDayClick(dateStr)}
              onDoubleClick={() => handleDayDblClick(dateStr)}
            >
              <div className="cal-day-num">{cell.day}</div>
              <div className="cal-events">
                {dayEvents.slice(0, 3).map(ev => {
                  const cat = getCategoryById(ev.categoryId);
                  return (
                    <div
                      key={ev.id}
                      className="cal-event-label"
                      style={{ background: cat?.bg || 'var(--bg4)', color: cat?.color || 'var(--text2)' }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: '9px', color: 'var(--text3)' }}>+{dayEvents.length - 3} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px', fontWeight: '500' }}>
          Eventos em {MONTHS[month]}:
        </div>
        {events.filter(e => {
          const [y, m] = e.date.split('-').map(Number);
          return y === year && m === month + 1;
        }).length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Nenhum evento neste mês.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {events.filter(e => {
              const [y, m] = e.date.split('-').map(Number);
              return y === year && m === month + 1;
            }).sort((a,b) => a.date.localeCompare(b.date)).map(ev => {
              const cat = getCategoryById(ev.categoryId);
              return (
                <span key={ev.id} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: cat?.bg || 'var(--bg3)', color: cat?.color || 'var(--text2)' }}>
                  {new Date(ev.date + 'T00:00:00').getDate()} — {ev.title}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {showModal && <EventModal defaultDate={clickedDate} onClose={() => setShowModal(false)} />}
    </div>
  );
}