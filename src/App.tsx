import { useState } from 'react';
import DashboardSolicitudes from './pages/ServicioCliente/DashboardSolicitudes';
import EvaluarSolicitud from './pages/ServicioCliente/EvaluarSolicitud';

function App() {
  const [view, setView] = useState<'dashboard' | 'evaluar'>('dashboard');
  const [selectedSolicitud, setSelectedSolicitud] = useState<string | null>(null);

  const handleEvaluar = (id?: string) => {
    setSelectedSolicitud(id ?? null);
    setView('evaluar');
  };

  const handleBack = () => {
    setSelectedSolicitud(null);
    setView('dashboard');
  };

  return (
    <>
      {view === 'dashboard' ? (
        <DashboardSolicitudes onEvaluar={handleEvaluar} />
      ) : (
        <EvaluarSolicitud solicitudId={selectedSolicitud ?? undefined} onBack={handleBack} />
      )}
    </>
  );
}

export default App;