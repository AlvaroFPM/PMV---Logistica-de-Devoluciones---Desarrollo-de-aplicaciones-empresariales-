import { useState } from 'react';
import { ArrowLeft, User, ClipboardCheck, Plus, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import type { SolicitudInspeccion, ItemInspeccion, EstadoInspeccion, ObjetoEquivocado } from '../../types/devolucion';
import ItemCard from './ItemCard';
import ObjetoEquivocadoModal from './ObjetoEquivocadoModal';

interface InspectionScreenProps {
  solicitud: SolicitudInspeccion;
  onFinalizar: (updated: SolicitudInspeccion) => void;
  onBack: () => void;
}

const estadoBadgeStyle: Record<string, string> = {
  'En Inspección Física': 'bg-sky-100 text-sky-700 border-sky-200',
  'En Resolución Parcial': 'bg-amber-100 text-amber-700 border-amber-200',
  'Cerrado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function InspectionScreen({ solicitud, onFinalizar, onBack }: InspectionScreenProps) {
  const [items, setItems] = useState<ItemInspeccion[]>(solicitud.items);
  const [objetos, setObjetos] = useState<ObjetoEquivocado[]>(solicitud.objetos_equivocados);
  const [showModal, setShowModal] = useState(false);

  const allInspected = items.every(i => i.estado_inspeccion !== 'Pendiente');
  const pendingCount = items.filter(i => i.estado_inspeccion === 'Pendiente').length;

  const handleItemChange = (id: string, estado: EstadoInspeccion) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, estado_inspeccion: estado } : i));
  };

  const handleGuardarObjeto = (tipo: string, descripcion: string, fotoAdjunta: boolean) => {
    const nuevo: ObjetoEquivocado = {
      id: `OBJ-${Date.now()}`,
      tipo,
      descripcion,
      foto_adjunta: fotoAdjunta,
    };
    setObjetos(prev => [...prev, nuevo]);
    setShowModal(false);
  };

  const handleFinalizar = () => {
    onFinalizar({ ...solicitud, items, objetos_equivocados: objetos });
  };

  const badgeClass = estadoBadgeStyle[solicitud.estado_solicitud] ?? 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <>
      {/* Top nav */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">Inspección Física</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Master panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black text-slate-800 font-mono tracking-tight">
                  {solicitud.id_solicitud}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
                  {solicitud.estado_solicitud}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <User className="w-4 h-4" />
                <span>Cliente: <span className="font-semibold text-slate-700">{solicitud.cliente}</span></span>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-200 text-amber-700 rounded-xl text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Añadir Objeto Equivocado
            </button>
          </div>

          {/* Objetos equivocados list */}
          {objetos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Objetos Equivocados Registrados</p>
              <div className="space-y-2">
                {objetos.map(obj => (
                  <div key={obj.id} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-amber-800">{obj.tipo}</span>
                      {obj.descripcion && <span className="text-amber-700"> — {obj.descripcion}</span>}
                      {obj.foto_adjunta && (
                        <span className="ml-2 text-emerald-600 font-semibold">· foto adjunta</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Items section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Ítems de la Solicitud ({items.length})
            </h2>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" />
                {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
            {pendingCount === 0 && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Todos inspeccionados
              </span>
            )}
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <ItemCard key={item.id} item={item} onChange={handleItemChange} />
            ))}
          </div>
        </div>

        {/* Finalizar */}
        <div className="pt-2 pb-8">
          <button
            onClick={handleFinalizar}
            disabled={!allInspected}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all shadow-sm ${
              allInspected
                ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-sky-200 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allInspected ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Finalizar Inspección
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5" />
                Finalizar Inspección ({pendingCount} ítem{pendingCount > 1 ? 's' : ''} pendiente{pendingCount > 1 ? 's' : ''})
              </span>
            )}
          </button>
          {!allInspected && (
            <p className="text-center text-xs text-slate-400 mt-2">
              Debes asignar un estado a todos los ítems antes de finalizar.
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <ObjetoEquivocadoModal
          onClose={() => setShowModal(false)}
          onGuardar={handleGuardarObjeto}
        />
      )}
    </>
  );
}
