export type EstadoInspeccion =
  | 'Pendiente'
  | 'Aprobado - Apto reacondicionamiento'
  | 'Aprobado - Descarte Técnico'
  | 'Rechazado por Inconsistencia'
  | 'Rechazado por Fraude'
  | 'No Recibido';

export interface Item {
  id: string;
  nombre: string;
  motivo: string;
  n_serie: string;
  estado_inspeccion: EstadoInspeccion;
}

export interface ObjetoEquivocado {
  id: string;
  tipo: string;
  descripcion: string;
  foto_adjunta: boolean;
}

export interface Solicitud {
  id_solicitud: string;
  estado_solicitud: string;
  cliente: string;
  objetos_equivocados: ObjetoEquivocado[];
  items: Item[];
}

export interface AppState {
  solicitud_actual: string | null;
  base_datos: Record<string, Solicitud>;
}

export const initialDatabase: Record<string, Solicitud> = {
  'DEV-2026-085': {
    id_solicitud: 'DEV-2026-085',
    estado_solicitud: 'En Inspección Física',
    cliente: 'Juan Pérez',
    objetos_equivocados: [],
    items: [
      {
        id: 'ITM-001',
        nombre: 'Samsung Galaxy S24+',
        motivo: 'Garantía',
        n_serie: 'SN-998877',
        estado_inspeccion: 'Pendiente',
      },
      {
        id: 'ITM-002',
        nombre: 'Cargador 45W',
        motivo: 'Retracto',
        n_serie: 'N/A',
        estado_inspeccion: 'Pendiente',
      },
    ],
  },
};

export const OPCIONES_INSPECCION: EstadoInspeccion[] = [
  'Pendiente',
  'Aprobado - Apto reacondicionamiento',
  'Aprobado - Descarte Técnico',
  'Rechazado por Inconsistencia',
  'Rechazado por Fraude',
  'No Recibido',
];
