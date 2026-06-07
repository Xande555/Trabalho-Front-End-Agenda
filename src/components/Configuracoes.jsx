import React, { useState } from 'react';
import { Palette, Bell, Trash2, RotateCcw, Monitor, Moon, Sun, Leaf, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const THEMES_META = [
  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Escuro clássico', preview: ['#0f0f13','#16161d','#1e1e28','#7c6ff7'] },
  { id: 'midnight', label: 'Midnight', icon: Monitor, desc: 'Azul profundo', preview: ['#060b18','#0d1526','#142035','#60a5fa'] },
  { id: 'light', label: 'Light', icon: Sun, desc: 'Claro e limpo', preview: ['#f5f5f7','#ffffff','#ebebef','#7c6ff7'] },
  { id: 'forest', label: 'Forest', icon: Leaf, desc: 'Verde natureza', preview: ['#0d1610','#13201a','#1a2d22','#4ade80'] },
  { id: 'rose', label: 'Rose', icon: Heart, desc: 'Rosa elegante', preview: ['#180d10','#221318','#2e1a20','#f472b6'] },
];

const ACCENT_PRESETS = [
  { color: '#7c6ff7', label: 'Violeta' },
  { color: '#60a5fa', label: 'Azul' },
  { color: '#4ade80', label: 'Verde' },
  { color: '#fb923c', label: 'Laranja' },
  { color: '#f472b6', label: 'Rosa' },
  { color: '#f87171', label: 'Vermelho' },
  { color: '#facc15', label: 'Amarelo' },
  { color: '#2dd4bf', label: 'Teal' },
  { color: '#a78bfa', label: 'Roxo' },
  { color: '#38bdf8', label: 'Ciano' },
];

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <Icon size={16} style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function Configuracoes() {
  const { settings, updateSettings, clearNotifications, events, tasks, categories } = useApp();
  const [showReset, setShowReset] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Isso vai apagar todos os eventos, tarefas e notificações. Tem certeza?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Configurações</h2>
        <p style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '2px' }}>Personalize sua experiência na Agenda</p>
      </div>

      {/* Theme */}
      <Section icon={Palette} title="Tema da Interface">
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>
            Esquema de Cores
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {THEMES_META.map(t => {
              const Icon = t.icon;
              const isActive = settings.theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id })}
                  style={{
                    border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', padding: '12px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: isActive ? 'var(--accent-bg)' : 'var(--bg3)',
                  }}
                >
                  {/* Mini preview */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                    {t.preview.map((c, i) => (
                      <div key={i} style={{ flex: i < 3 ? 1 : 0, width: i === 3 ? '12px' : undefined, height: '24px', background: c, borderRadius: '3px' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <Icon size={11} style={{ color: isActive ? 'var(--accent)' : 'var(--text3)' }} />
                    <span style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400', color: isActive ? 'var(--accent)' : 'var(--text)' }}>{t.label}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>{t.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent color */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>
            Cor de Destaque
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {ACCENT_PRESETS.map(({ color, label }) => (
              <div
                key={color}
                onClick={() => updateSettings({ accentColor: color })}
                title={label}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: color,
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: settings.accentColor === color ? '2px solid white' : '2px solid transparent',
                  boxShadow: settings.accentColor === color ? `0 0 0 2px ${color}, 0 0 8px ${color}66` : 'none',
                }}
              />
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
              <input
                type="color"
                value={settings.accentColor}
                onChange={e => updateSettings({ accentColor: e.target.value })}
                style={{ width: '40px', height: '34px', borderRadius: '6px', border: '1px solid var(--border2)', background: 'var(--bg3)', cursor: 'pointer', padding: '2px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Personalizada</span>
            </div>
          </div>

          {/* Live preview bar */}
          <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ fontSize: '13px', color: 'var(--accent)' }}>Prévia ao vivo — essa é a cor de destaque atual</span>
            <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Botão primário</button>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notificações">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>Alertas de proximidade</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>Receba avisos quando um evento estiver chegando</div>
            </div>
            <div
              style={{
                width: '44px', height: '24px', borderRadius: '99px',
                background: settings.notifEnabled ? 'var(--accent)' : 'var(--bg4)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                border: '1px solid var(--border2)', flexShrink: 0,
              }}
              onClick={() => updateSettings({ notifEnabled: !settings.notifEnabled })}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: settings.notifEnabled ? '22px' : '3px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: 'white', transition: 'left 0.2s',
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: settings.notifEnabled ? 1 : 0.4 }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>Antecedência do alerta</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>Quantos minutos antes avisar</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[5, 10, 15, 30, 60].map(m => (
                <button
                  key={m}
                  disabled={!settings.notifEnabled}
                  className={`btn btn-sm ${settings.notifAdvanceMinutes === m ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => updateSettings({ notifAdvanceMinutes: m })}
                >
                  {m}min
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Data */}
      <Section icon={Trash2} title="Dados">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13px' }}>Eventos cadastrados</div>
            <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--accent)' }}>{events.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13px' }}>Tarefas cadastradas</div>
            <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--success)' }}>{tasks.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg3)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '13px' }}>Categorias</div>
            <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--warn)' }}>{categories.length}</span>
          </div>
          <div style={{ marginTop: '8px', padding: '12px', border: '1px solid var(--danger-bg)', borderRadius: 'var(--radius-sm)', background: 'var(--danger-bg)' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--danger)', marginBottom: '6px' }}>⚠️ Zona de Perigo</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>
              Apaga permanentemente todos os eventos, tarefas, notificações e configurações salvas. Esta ação é irreversível.
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleResetData}>
              <RotateCcw size={13} /> Resetar todos os dados
            </button>
          </div>
        </div>
      </Section>

      {/* About */}
      <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text3)', fontSize: '12px' }}>
        Agenda App · Desenvolvido com React JS · 2026
      </div>
    </div>
  );
}