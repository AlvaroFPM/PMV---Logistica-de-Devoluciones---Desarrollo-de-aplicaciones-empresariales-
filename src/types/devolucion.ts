export type EstadoMaestro =
  | 'Creada' | 'En Revisión' | 'Aprobada para Envío' | 'En Tránsito'
  | 'En Inspección Física' | 'Pendiente de Reembolso' | 'Reembolso en Proceso'
  | 'En Resolución Parcial' | 'En Gestión de Reenvío' | 'Finalizada con Éxito'
  | 'Cerrada — Reenviada al Cliente' | 'Cerrada — Producto Abandonado'
  | 'Cancelada — Rechazo Documental' | 'Cancelada — Plazo de Envío Expirado'
  | 'Cancelada — Plazo Bancario Expirado' | 'Cancelada por el Cliente'
  | 'Rechazada por Inconsistencia Física';

export type EstadoItem =
  | 'Pendiente' | 'Aprobado — Apto para Reacondicionamiento'
  | 'Aprobado — Descarte Técnico' | 'Rechazado por Inconsistencia Física'
  | 'Rechazado por Fraude' | 'No Recibido' | 'Objeto Equivocado Retenido';

export type EstadoInspeccion =
  | 'Pendiente'
  | 'Aprobado - Apto reacondicionamiento'
  | 'Aprobado - Descarte Técnico'
  | 'Rechazado por Inconsistencia'
  | 'Rechazado por Fraude'
  | 'No Recibido';

export interface ClienteInfo {
  rut: string;
  nombre: string;
  email?: string;
  banco: string;
  cuenta: string;
}

export interface ItemMaestro {
  id: string;
  nombreProducto: string;
  precio: number;
  motivo: string;
  descripcion: string;
  evidencia: string;
  estado: EstadoItem;
  n_serie: string;
}

export interface ObjetoEquivocado {
  id: string;
  tipo: string;
  descripcion: string;
  foto_adjunta: boolean;
  foto_url?: string;
}

export interface ItemInspeccion {
  id: string;
  nombre: string;
  motivo: string;
  n_serie: string;
  estado_inspeccion: EstadoInspeccion;
}

export interface SolicitudInspeccion {
  id_solicitud: string;
  estado_solicitud: string;
  cliente: string;
  objetos_equivocados: ObjetoEquivocado[];
  items: ItemInspeccion[];
}

export const OPCIONES_INSPECCION: EstadoInspeccion[] = [
  'Pendiente',
  'Aprobado - Apto reacondicionamiento',
  'Aprobado - Descarte Técnico',
  'Rechazado por Inconsistencia',
  'Rechazado por Fraude',
  'No Recibido'
];

export interface SolicitudMaestra {
  id: string;
  idOrdenCompra: string;
  fechaCreacion: string;
  estado: EstadoMaestro;
  cliente: ClienteInfo;
  costoEnvioOriginal: number;
  totalProductosOrden?: number;
  items: ItemMaestro[];
  objetos_equivocados: ObjetoEquivocado[];
  diasParaExpirar?: number | null;
  recuperacionesCoordinadas?: string[];
}

export interface UsuarioSession {
  usuario: string;
  rol: 'cliente' | 'servicio_cliente' | 'inspector' | 'ejecutivo_pagos';
  nombre: string;
}

export interface UsuarioCuenta {
  email: string;
  password: string;
  rol: UsuarioSession['rol'];
  nombre: string;
}

export interface ItemFormState {
  seleccionado: boolean;
  motivo: string;
  comentarios: string;
  evidencia: string;
}

export type ItemDevolucion = ItemMaestro;
export type SolicitudDevolucion = SolicitudMaestra;