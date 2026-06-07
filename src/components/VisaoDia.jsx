import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventModal from './EventModal';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function VisaoDia() {
  const { selectedDate, setSelectedDate, getEventsByDate, getCategoryById, deleteEvent } = useApp();
  const [editEvent, setEditEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newEventHour, setNewEventHour] = useState(9);

  const today = new Date().toISOString().split('T')[0];

  const goDay = (delta) => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const dateObj = new Date(selectedDate + 'T00:00:00');
  const dateLabel = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const isToday = selectedDate === today;

  const dayEvents = getEventsByDate(selectedDate);

  const getEventsForHour = (hour) => dayEvents.filter(e => e.hour === hour);

  const handleSlotClick = (hour) => {
    setNewEventHour(hour);
    setEditEvent(null);
    setShowModal(true);
  };

  const handleEditClick = (e, ev) => {
    e.stopPropagation();
    setEditEvent(ev);
    setShowModal(true);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    deleteEvent(id);
  };

  const currentHour = new Date().getHours();

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Visão do Dia</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isToday && (
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDate(today)}>Hoje</button>
          )}
          <button className="btn btn-ghost btn-icon" onClick={() => goDay(-1)}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '13px', color: 'var(--text2)', minWidth: '220px', textAlign: 'center', textTransform: 'capitalize' }}>
            {isToday && <span style={{ color: 'var(--accent2)', fontWeight: '500' }}>Hoje · </span>}
            {dateLabel}
          </span>
          <button className="btn btn-ghost btn-icon" onClick={() => goDay(1)}><ChevronRight size={16} /></button>
          <button className="btn btn-primary btn-sm" onClick={() => { setEditEvent(null); setShowModal(true); }}>
            <Plus size={13} /> Evento
          </button>
        </div>
      </div>

      {dayEvents.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {dayEvents.sort((a,b) => a.hour - b.hour).map(ev => {
            const cat = getCategoryById(ev.categoryId);
            return (
              <span key={ev.id} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: cat?.bg, color: cat?.color }}>
                {String(ev.hour).padStart(2,'0')}h · {ev.title}
              </span>
            );
          })}
        </div>
      )}

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="timeline">
          {HOURS.map(hour => {
            const hourEvents = getEventsForHour(hour);
            const isCurrent = isToday && hour === currentHour;

            return (
              <div
                key={hour}
                className="timeline-hour"
                style={{ background: isCurrent ? 'var(--accent-bg)' : undefined, cursor: 'pointer' }}
                onClick={() => handleSlotClick(hour)}
                title="Clique para adicionar evento neste horário"
              >
                <div className="timeline-label" style={{ color: isCurrent ? 'var(--accent2)' : undefined }}>
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="timeline-slot">
                  {isCurrent && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent)', borderRadius: '99px' }} />
                  )}
                  {hourEvents.map(ev => {
                    const cat = getCategoryById(ev.categoryId);
                    return (
                      <div
                        key={ev.id}
                        className="timeline-event"
                        style={{
                          background: cat?.bg || 'var(--bg3)',
                          borderLeft: `3px solid ${cat?.color || 'var(--accent)'}`,
                          color: 'var(--text)',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '500', fontSize: '13px', marginBottom: '2px' }}>{ev.title}</div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={10} /> {String(ev.hour).padStart(2,'0')}:00 — {String(ev.hour + ev.duration).padStart(2,'0')}:00
                              </span>
                              {ev.location && (
                                <span style={{ fontSize: '11px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <MapPin size={10} /> {ev.location}
                                </span>
                              )}
                              {cat && (
                                <span style={{ fontSize: '10px', color: cat.color, background: cat.bg, padding: '1px 6px', borderRadius: '99px' }}>
                                  {cat.name}
                                </span>
                              )}
                            </div>
                            {ev.description && (
                              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>{ev.description}</div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                            <button className="btn btn-ghost btn-icon" style={{ width: '26px', height: '26px', padding: '4px' }} onClick={e => handleEditClick(e, ev)}>
                              <Edit2 size={12} />
                            </button>
                            <button className="btn btn-danger btn-icon" style={{ width: '26px', height: '26px', padding: '4px' }} onClick={e => handleDeleteClick(e, ev.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {hourEvents.length === 0 && (
                    <div style={{ height: '100%', minHeight: '48px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text3)', opacity: 0, transition: 'opacity 0.15s' }}
                        className="slot-hint">+ Adicionar evento</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <EventModal
          event={editEvent}
          defaultDate={selectedDate}
          onClose={() => { setShowModal(false); setEditEvent(null); }}
        />
      )}

      <style>{`.timeline-hour:hover .slot-hint { opacity: 1 !important; }`}</style>
    </div>
  );
}