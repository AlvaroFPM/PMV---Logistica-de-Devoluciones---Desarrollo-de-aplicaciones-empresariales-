import { useState } from 'react';
import DashboardSolicitudes from './pages/ServicioCliente/DashboardSolicitudes';
import EvaluarSolicitud from './pages/ServicioCliente/EvaluarSolicitud';
import SearchScreen from './pages/InspectorCalidad/SearchScreen';
import InspectionScreen from './pages/InspectorCalidad/InspectionScreen';
import Toast from './components/Toast';
import type { AppState, Solicitud } from './pages/InspectorCalidad/mockData';
import { initialDatabase } from './pages/InspectorCalidad/mockData';

// ─── Módulo temporal de selección de rol ───────────────────────────────────
type Modulo = 'selector' | 'servicioCliente' | 'inspectorCalidad';

function App() {
  // Navegación global entre módulos
  const [modulo, setModulo] = useState<Modulo>('selector');

  // ── Estado Servicio al Cliente ──
  const [scView, setScView] = useState<'dashboard' | 'evaluar'>('dashboard');
  const [selectedSolicitud, setSelectedSolicitud] = useState<string | null>(null);

  // ── Estado Inspector de Calidad ──
  const [icState, setIcState] = useState<AppState>({
    solicitud_actual: null,
    base_datos: initialDatabase,
  });
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  // ── Handlers Servicio al Cliente ──
  const handleEvaluar = (id?: string) => {
    setSelectedSolicitud(id ?? null);
    setScView('evaluar');
  };
  const handleBackSC = () => {
    setSelectedSolicitud(null);
    setScView('dashboard');
  };

  // ── Handlers Inspector de Calidad ──
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3500);
  };

  const handleSearch = (codigo: string): { found: boolean; error?: string } => {
    const solicitud = icState.base_datos[codigo];
    if (solicitud) {
      setIcState(prev => ({ ...prev, solicitud_actual: solicitud.id_solicitud }));
      return { found: true };
    }
    return { found: false, error: 'Solicitud no encontrada.' };
  };

  const handleFinalizarInspeccion = (updatedSolicitud: Solicitud) => {
    setIcState(prev => ({
      solicitud_actual: null,
      base_datos: {
        ...prev.base_datos,
        [updatedSolicitud.id_solicitud]: {
          ...updatedSolicitud,
          estado_solicitud: 'En Resolución Parcial',
        },
      },
    }));
    showToast('Inspección guardada. Estado final: En Resolución Parcial');
  };

  const currentSolicitud = icState.solicitud_actual
    ? icState.base_datos[icState.solicitud_actual]
    : null;

  // ── Render ──
  if (modulo === 'selector') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-2xl font-bold text-slate-800">Logística de Devoluciones</h1>
        <p className="text-slate-500 text-sm">Selecciona tu rol para continuar</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setModulo('servicioCliente')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            Servicio al Cliente
          </button>
          <button
            onClick={() => setModulo('inspectorCalidad')}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            Inspector de Calidad
          </button>
        </div>
      </div>
    );
  }

  if (modulo === 'servicioCliente') {
    return (
      <>
        <button
          onClick={() => { setModulo('selector'); setScView('dashboard'); }}
          className="fixed top-3 right-4 z-50 text-xs text-slate-400 hover:text-slate-600 underline"
        >
          ← Cambiar rol
        </button>
        {scView === 'dashboard' ? (
          <DashboardSolicitudes onEvaluar={handleEvaluar} />
        ) : (
          <EvaluarSolicitud solicitudId={selectedSolicitud ?? undefined} onBack={handleBackSC} />
        )}
      </>
    );
  }

  // modulo === 'inspectorCalidad'
  return (
    <div className="min-h-screen bg-slate-50">
      <button
        onClick={() => { setModulo('selector'); setIcState({ solicitud_actual: null, base_datos: initialDatabase }); }}
        className="fixed top-3 right-4 z-50 text-xs text-slate-400 hover:text-slate-600 underline"
      >
        ← Cambiar rol
      </button>
      {currentSolicitud ? (
        <InspectionScreen
          solicitud={currentSolicitud}
          onFinalizar={handleFinalizarInspeccion}
          onBack={() => setIcState(prev => ({ ...prev, solicitud_actual: null }))}
        />
      ) : (
        <SearchScreen onSearch={handleSearch} showToast={showToast} />
      )}
      {toast.visible && <Toast message={toast.message} />}
    </div>
  );
}

export default App;