import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Trabalho', color: '#7c6ff7', bg: 'rgba(124,111,247,0.15)' },
  { id: 'personal', name: 'Pessoal', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  { id: 'health', name: 'Saúde', color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  { id: 'study', name: 'Estudo', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  { id: 'social', name: 'Social', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
];

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

export function AppProvider({ children }) {
  const [events, setEvents] = useState(() => load('agenda_events', SAMPLE_EVENTS));
  const [tasks, setTasks] = useState(() => load('agenda_tasks', SAMPLE_TASKS));
  const [categories, setCategories] = useState(() => load('agenda_categories', DEFAULT_CATEGORIES));
  const [notifications, setNotifications] = useState(() => load('agenda_notifs', []));
  const [toasts, setToasts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [settings, setSettings] = useState(() =>load('agenda_settings', {theme: 'dark',accentColor: '#7c6ff7',notifEnabled: true,notifAdvanceMinutes: 15,}));
  const updateSettings = useCallback((data) => {setSettings(prev => ({...prev,...data}));}, []);

  useEffect(() => { localStorage.setItem('agenda_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('agenda_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('agenda_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('agenda_notifs', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => {localStorage.setItem('agenda_settings',JSON.stringify(settings));}, [settings]);
  useEffect(() => {document.documentElement.style.setProperty('--accent',settings.accentColor);document.documentElement.style.setProperty('--accent2',settings.accentColor);}, [settings.accentColor]);
  
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

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

  const updateTask = useCallback((id, data) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

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
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(p => p.filter(c => c.id !== id));
    addToast('Categoria removida.', 'info');
  }, [addToast]);

  const markAllNotifRead = useCallback(() => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getCategoryById = useCallback((id) => categories.find(c => c.id === id), [categories]);
  const getEventsByDate = useCallback((date) => events.filter(e => e.date === date), [events]);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
 <AppContext.Provider
    value={{
      events,
      tasks,
      categories,
      notifications,
      toasts,
      settings,

      selectedDate,
      setSelectedDate,

      addEvent,
      updateEvent,
      deleteEvent,

      addTask,
      updateTask,
      deleteTask,
      toggleTask,

      addCategory,
      updateCategory,
      deleteCategory,

      markAllNotifRead,
      clearNotifications,

      updateSettings,

      getCategoryById,
      getEventsByDate,

      unreadCount,
      addToast
    }}
  >
    {children}
  </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
