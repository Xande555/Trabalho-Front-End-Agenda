import './styles/index.css';

import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Calendario from './components/Calendario';
import VisaoDia from './components/VisaoDia';
import Tarefas from './components/Tarefas';
import Notificacoes from './components/Notificacoes';
import Configuracoes from './components/Configuracoes';
import Categorias from './components/Categorias';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/dia" element={<VisaoDia />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;