import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, X, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function SearchScreen() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [notas, setNotas] = useState('');
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();

  const handleSearch = () => {
    if (!codigo.trim()) {
      setError('Ingresa un código de solicitud.');
      return;
    }

    const encontrada = solicitudes.find((solicitud) => solicitud.id === codigo.trim().toUpperCase());

    if (encontrada) {
      if (encontrada.estado !== 'En Inspección Física' && encontrada.estado !== 'En Tránsito') {
        setError(`Solicitud encontrada, pero su estado actual es "${encontrada.estado}". No apta para inspección ahora mismo.`);
      } else {
        navigate(`/inspector-calidad/inspeccion/${encontrada.id}`);
      }
    } else {
      setError('No encontrado en el sistema.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleGuardarPaquete = () => {
    alert('Paquete no identificado registrado exitosamente.');
    setNotas('');
    setShowModal(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-600 rounded-2xl mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Inspector de Calidad</h1>
          <p className="text-slate-500 mt-1 text-sm">Sistema de Inspección Logística</p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Código de Solicitud
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={codigo}
                onChange={e => { setCodigo(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="Ej: DEV-2026-085"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition placeholder-slate-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              Buscar
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 rounded-xl font-semibold text-sm transition-all border border-red-200"
            >
              <Package className="w-4 h-4" />
              Registrar Paquete no Identificado
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-400">Escanea o ingresa manualmente el código de solicitud</p>
      </div>

      {/* Modal Paquete no identificado */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Paquete no Identificado</h2>
                <p className="text-xs text-slate-500 mt-0.5">Registra los detalles del paquete encontrado</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setNotas(''); }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notas de Observación</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              rows={4}
              placeholder="Describe el paquete, condición, ubicación donde fue encontrado..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none placeholder-slate-400"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowModal(false); setNotas(''); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarPaquete}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm"
              >
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
