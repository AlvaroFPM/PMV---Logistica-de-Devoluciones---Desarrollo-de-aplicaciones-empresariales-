// src/types/devolucion.ts

export type EstadoMaestro = 
  | 'Creada' | 'En Revisión' | 'Aprobada para Envío' | 'En Tránsito' 
  | 'En Inspección Física' | 'Pendiente de Reembolso' | 'Reembolso en Proceso' 
  | 'En Resolución Parcial' | 'En Gestión de Reenvío' | 'Finalizada con Éxito' 
  | 'Cerrada — Reenviada al Cliente' | 'Cerrada — Producto Abandonado' 
  | 'Cancelada — Rechazo Documental' | 'Cancelada — Plazo de Envío Expirado' 
  | 'Cancelada — Plazo Bancario Expirado' | 'Cancelada por el Cliente';

export type EstadoItem = 
  | 'Pendiente' | 'Aprobado — Apto para Reacondicionamiento' 
  | 'Aprobado — Descarte Técnico' | 'Rechazado por Inconsistencia Física' 
  | 'Rechazado por Fraude' | 'No Recibido' | 'Objeto Equivocado Retenido';

export interface ItemDevolucion {
  id: string;
  nombreProducto: string;
  motivo: string;
  evidencia: string; // URL simulada
  estado: EstadoItem;
}

export interface SolicitudDevolucion {
  id: string;
  idOrdenCompra: string;
  fechaCreacion: string;
  estado: EstadoMaestro;
  items: ItemDevolucion[];
  requiereNuevosDatosBancarios?: boolean; // Flag visual para el banner rojo
}

export interface ItemFormState {
  seleccionado: boolean;
  motivo: string;
  comentarios: string;
  evidencia: string; // Guardaremos el nombre del archivo para simular
}