// src/components/BadgeEstado.tsx

import type { EstadoMaestro, EstadoItem } from '../types/devolucion';

// Tipamos para que acepte tanto el estado maestro como el del ítem
type EstadoPermitido = EstadoMaestro | EstadoItem;

const MAPA_ESTADOS_ESTILOS: Record<EstadoPermitido, string> = {
  // Estados Maestro
  'Creada': 'bg-blue-50 text-blue-700 border-blue-200',
  'En Revisión': 'bg-blue-50 text-blue-700 border-blue-200',
  'Aprobada para Envío': 'bg-amber-50 text-amber-700 border-amber-200',
  'En Tránsito': 'bg-amber-50 text-amber-700 border-amber-200',
  'En Inspección Física': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pendiente de Reembolso': 'bg-purple-50 text-purple-700 border-purple-200',
  'Reembolso en Proceso': 'bg-purple-50 text-purple-700 border-purple-200',
  'Finalizada con Éxito': 'bg-green-50 text-green-700 border-green-200',
  'En Resolución Parcial': 'bg-orange-50 text-orange-700 border-orange-200',
  'En Gestión de Reenvío': 'bg-red-50 text-red-700 border-red-200',
  'Cerrada — Reenviada al Cliente': 'bg-zinc-100 text-zinc-700 border-zinc-300',
  'Cerrada — Producto Abandonado': 'bg-zinc-100 text-zinc-700 border-zinc-300',
  'Cancelada — Rechazo Documental': 'bg-rose-900 text-rose-100 border-rose-950',
  'Cancelada — Plazo de Envío Expirado': 'bg-rose-900 text-rose-100 border-rose-950',
  'Cancelada — Plazo Bancario Expirado': 'bg-rose-900 text-rose-100 border-rose-950',
  'Cancelada por el Cliente': 'bg-rose-900 text-rose-100 border-rose-950',
  'Rechazada por Inconsistencia Física': 'bg-rose-900 text-rose-100 border-rose-950',

  // Estados Ítem
  'Pendiente': 'bg-gray-100 text-gray-700 border-gray-300',
  'Aprobado — Apto para Reacondicionamiento': 'bg-green-50 text-green-700 border-green-200',
  'Aprobado — Descarte Técnico': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rechazado por Inconsistencia Física': 'bg-red-50 text-red-700 border-red-200',
  'Rechazado por Fraude': 'bg-rose-900 text-rose-100 border-rose-950',
  'No Recibido': 'bg-zinc-100 text-zinc-700 border-zinc-300',
  'Objeto Equivocado Retenido': 'bg-orange-50 text-orange-700 border-orange-200'
};

interface BadgeEstadoProps {
  estado: EstadoPermitido;
}

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  const estilosVisuales = MAPA_ESTADOS_ESTILOS[estado] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estilosVisuales}`}>
      {estado}
    </span>
  );
}