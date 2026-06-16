import type { ItemInspeccion, EstadoInspeccion } from '../../types/devolucion';
import { OPCIONES_INSPECCION } from '../../types/devolucion';
import { Tag, Hash, ChevronDown } from 'lucide-react';

interface ItemCardProps {
  item: ItemInspeccion;
  onChange: (id: string, estado: EstadoInspeccion) => void;
}

function getSelectStyle(estado: EstadoInspeccion): string {
  if (estado.startsWith('Aprobado')) return 'text-emerald-700 bg-emerald-50 border-emerald-200 focus:ring-emerald-400';
  if (estado.startsWith('Rechazado')) return 'text-red-700 bg-red-50 border-red-200 focus:ring-red-400';
  if (estado === 'No Recibido') return 'text-amber-700 bg-amber-50 border-amber-200 focus:ring-amber-400';
  return 'text-slate-600 bg-slate-50 border-slate-200 focus:ring-sky-400';
}

function getOptionStyle(op: EstadoInspeccion): string {
  if (op.startsWith('Aprobado')) return 'text-emerald-700';
  if (op.startsWith('Rechazado')) return 'text-red-700';
  if (op === 'No Recibido') return 'text-amber-700';
  return 'text-slate-700';
}

export default function ItemCard({ item, onChange }: ItemCardProps) {
  const selectBase = 'appearance-none w-full pl-3 pr-8 py-2.5 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 transition cursor-pointer';

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Left: item info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{item.id}</span>
          </div>
          <h3 className="font-bold text-slate-800 text-base leading-tight">{item.nombre}</h3>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Tag className="w-3.5 h-3.5" />
              Motivo: <span className="font-semibold text-slate-700">{item.motivo}</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Hash className="w-3.5 h-3.5" />
              N° Serie: <span className="font-semibold font-mono text-slate-700">{item.n_serie}</span>
            </span>
          </div>
        </div>

        {/* Right: select */}
        <div className="shrink-0 w-64">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Estado de Inspección</label>
          <div className="relative">
            <select
              value={item.estado_inspeccion}
              onChange={e => onChange(item.id, e.target.value as EstadoInspeccion)}
              className={`${selectBase} ${getSelectStyle(item.estado_inspeccion)}`}
            >
              {OPCIONES_INSPECCION.map(op => (
                <option key={op} value={op} className={getOptionStyle(op)}>
                  {op}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
