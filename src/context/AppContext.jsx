import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AppContext = createContext(null);

const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Trabalho', color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)' },
  { id: 'personal', name: 'Pessoal', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  { id: 'health', name: 'Saúde', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  { id: 'study', name: 'Estudo', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  { id: 'social', name: 'Social', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
];

const SAMPLE_EVENTS = [];

const SAMPLE_TASKS = [];

const DEFAULT_SETTINGS = {
  theme: 'dark',
  notifEnabled: true,
  notifAdvanceMinutes: 15,
  accentColor: '#7c6ff7',
};

const THEMES = {
  dark: {
    '--bg': '#0f0f13', '--bg2': '#16161d', '--bg3': '#1e1e28', '--bg4': '#252532',
    '--border': 'rgba(255,255,255,0.08)', '--border2': 'rgba(255,255,255,0.14)',
    '--text': '#f0eff8', '--text2': '#9896b0', '--text3': '#5e5d72',
  },
  midnight: {
    '--bg': '#060b18', '--bg2': '#0d1526', '--bg3': '#142035', '--bg4': '#1b2940',
    '--border': 'rgba(255,255,255,0.07)', '--border2': 'rgba(255,255,255,0.12)',
    '--text': '#e8eef8', '--text2': '#8899bb', '--text3': '#4a5a7a',
  },
  light: {
    '--bg': '#f5f5f7', '--bg2': '#ffffff', '--bg3': '#ebebef', '--bg4': '#e0e0e6',
    '--border': 'rgba(0,0,0,0.08)', '--border2': 'rgba(0,0,0,0.14)',
    '--text': '#1a1a2e', '--text2': '#5a5a7a', '--text3': '#9090aa',
  },
  forest: {
    '--bg': '#0d1610', '--bg2': '#13201a', '--bg3': '#1a2d22', '--bg4': '#213829',
    '--border': 'rgba(255,255,255,0.07)', '--border2': 'rgba(255,255,255,0.12)',
    '--text': '#e8f5ec', '--text2': '#8ab89a', '--text3': '#4a7a5a',
  },
  rose: {
    '--bg': '#180d10', '--bg2': '#221318', '--bg3': '#2e1a20', '--bg4': '#3a2028',
    '--border': 'rgba(255,255,255,0.07)', '--border2': 'rgba(255,255,255,0.12)',
    '--text': '#f8eaec', '--text2': '#c0909a', '--text3': '#7a5060',
  },
};

const DATA_VERSION = 'v2'; // bump to clear old sample data

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

// Clear old sample data if version changed
if (localStorage.getItem('agenda_data_version') !== DATA_VERSION) {
  ['agenda_events', 'agenda_tasks', 'agenda_notifs', 'agenda_fired'].forEach(k => localStorage.removeItem(k));
  localStorage.setItem('agenda_data_version', DATA_VERSION);
}

export function AppProvider({ children }) {
  const [events, setEvents] = useState(() => load('agenda_events', SAMPLE_EVENTS));
  const [tasks, setTasks] = useState(() => load('agenda_tasks', SAMPLE_TASKS));
  const [categories, setCategories] = useState(() => load('agenda_categories', DEFAULT_CATEGORIES));
  const [notifications, setNotifications] = useState(() => load('agenda_notifs', []));
  const [settings, setSettings] = useState(() => load('agenda_settings', DEFAULT_SETTINGS));
  const [toasts, setToasts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const firedRef = useRef(new Set(load('agenda_fired', [])));

  // Apply theme to CSS vars
  useEffect(() => {
    const theme = THEMES[settings.theme] || THEMES.dark;
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('--accent', settings.accentColor);
    const hex = settings.accentColor;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    root.style.setProperty('--accent2', hex);
    root.style.setProperty('--accent-bg', `rgba(${r},${g},${b},0.12)`);
    root.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.3)`);
  }, [settings.theme, settings.accentColor]);

  // Persist
  useEffect(() => { localStorage.setItem('agenda_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('agenda_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('agenda_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('agenda_notifs', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('agenda_settings', JSON.stringify(settings)); }, [settings]);

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  // ─── Proximity notifications (runs every minute) ───────────────────────────
  useEffect(() => {
    if (!settings.notifEnabled) return;
    const check = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const advMin = settings.notifAdvanceMinutes || 15;
      events.forEach(ev => {
        const evDate = new Date(`${ev.date}T${String(ev.hour).padStart(2,'0')}:00:00`);
        const diffMs = evDate - now;
        const diffMin = diffMs / 60000;
        const fireKey = `${ev.id}_${advMin}`;
        if (diffMin > 0 && diffMin <= advMin && !firedRef.current.has(fireKey)) {
          firedRef.current.add(fireKey);
          localStorage.setItem('agenda_fired', JSON.stringify([...firedRef.current]));
          const mins = Math.round(diffMin);
          const msg = `⏰ "${ev.title}" começa em ${mins} minuto${mins !== 1 ? 's' : ''}!`;
          addToast(msg, 'info');
          setNotifications(p => {
            const notif = { id: `n${Date.now()}`, text: msg, time: new Date().toISOString(), read: false, type: 'alert' };
            return [notif, ...p].slice(0, 50);
          });
        }
      });
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [events, settings.notifEnabled, settings.notifAdvanceMinutes, addToast]);

  const addEvent = useCallback((ev) => {
    const newEv = { ...ev, id: `e${Date.now()}` };
    setEvents(p => [...p, newEv]);
    const notif = { id: `n${Date.now()}`, text: `Evento criado: "${ev.title}"`, time: new Date().toISOString(), read: false, type: 'event' };
    setNotifications(p => [notif, ...p].slice(0, 50));
    addToast(`Evento "${ev.title}" adicionado!`, 'success');
  }, [addToast]);

  const updateEvent = useCallback((id, data) => {
    setEvents(p => p.map(e => e.id === id ? { ...e, ...data } : e));
    addToast('Evento atualizado!', 'success');
  }, [addToast]);

  const deleteEvent = useCallback((id) => {
    setEvents(p => p.filter(e => e.id !== id));
    addToast('Evento removido.', 'info');
  }, [addToast]);

  const addTask = useCallback((task) => {
    const newTask = { ...task, id: `t${Date.now()}`, done: false };
    setTasks(p => [...p, newTask]);
    const notif = { id: `n${Date.now()}`, text: `Tarefa criada: "${task.title}"`, time: new Date().toISOString(), read: false, type: 'task' };
    setNotifications(p => [notif, ...p].slice(0, 50));
    addToast(`Tarefa "${task.title}" adicionada!`, 'success');
  }, [addToast]);

  const updateTask = useCallback((id, data) => { setTasks(p => p.map(t => t.id === id ? { ...t, ...data } : t)); }, []);

  const deleteTask = useCallback((id) => {
    setTasks(p => p.filter(t => t.id !== id));
    addToast('Tarefa removida.', 'info');
  }, [addToast]);

  const toggleTask = useCallback((id) => {
    setTasks(p => p.map(t => {
      if (t.id !== id) return t;
      const done = !t.done;
      if (done) addToast(`✓ "${t.title}" concluída!`, 'success');
      return { ...t, done };
    }));
  }, [addToast]);

  const addCategory = useCallback((cat) => {
    const newCat = { ...cat, id: `cat${Date.now()}` };
    setCategories(p => [...p, newCat]);
    addToast(`Categoria "${cat.name}" criada!`, 'success');
  }, [addToast]);

  const updateCategory = useCallback((id, data) => {
    setCategories(p => p.map(c => c.id === id ? { ...c, ...data } : c));
    addToast('Categoria atualizada!', 'success');
  }, [addToast]);

  const deleteCategory = useCallback((id) => {
    setCategories(p => p.filter(c => c.id !== id));
    addToast('Categoria removida.', 'info');
  }, [addToast]);

  const updateSettings = useCallback((data) => {
    setSettings(p => ({ ...p, ...data }));
    addToast('Configurações salvas!', 'success');
  }, [addToast]);

  const markAllNotifRead = useCallback(() => { setNotifications(p => p.map(n => ({ ...n, read: true }))); }, []);
  const clearNotifications = useCallback(() => { setNotifications([]); }, []);

  const getCategoryById = useCallback((id) => categories.find(c => c.id === id), [categories]);
  const getEventsByDate = useCallback((date) => events.filter(e => e.date === date), [events]);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      events, tasks, categories, notifications, toasts, settings, selectedDate,
      setSelectedDate, addEvent, updateEvent, deleteEvent,
      addTask, updateTask, deleteTask, toggleTask,
      addCategory, updateCategory, deleteCategory,
      updateSettings, markAllNotifRead, clearNotifications,
      getCategoryById, getEventsByDate, unreadCount, addToast,
      THEMES,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
