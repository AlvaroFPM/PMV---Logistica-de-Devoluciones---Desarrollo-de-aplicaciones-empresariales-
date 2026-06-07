import { useState } from 'react';
import BandejaPagos from './pages/EjecutivoPagos/BandejaPagos';
import ProcesarPago from './pages/EjecutivoPagos/ProcesarPago';

function App() {
  const [view, setView] = useState<'bandeja' | 'procesar'>('bandeja');
  const [selectedSolicitud, setSelectedSolicitud] = useState<string | null>(null);

  const handleProcesar = (id: string) => {
    setSelectedSolicitud(id);
    setView('procesar');
  };

  return (
    <div>
      <main>
        {view === 'bandeja' && <BandejaPagos onProcesar={handleProcesar} />}

        {view === 'procesar' && (
          <div className="p-6">
            <button onClick={() => setView('bandeja')} className="mb-4 px-3 py-1 rounded bg-gray-200">Volver</button>
            <ProcesarPago solicitudId={selectedSolicitud ?? undefined} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;