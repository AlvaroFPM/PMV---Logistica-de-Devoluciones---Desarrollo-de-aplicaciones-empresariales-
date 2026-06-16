import type { EstadoMaestro, ItemMaestro, ObjetoEquivocado, SolicitudMaestra } from '../types/devolucion';

export const evaluarPorServicioCliente = (solicitud: SolicitudMaestra, decisiones: Record<string, string>): SolicitudMaestra => {
  const rechazos = Object.values(decisiones).some((decision) => decision.includes('Rechazar'));

  return {
    ...solicitud,
    estado: rechazos ? 'Cancelada — Rechazo Documental' : 'Aprobada para Envío'
  };
};

export const finalizarInspeccionFisica = (solicitud: SolicitudMaestra, items: ItemMaestro[], objetos: ObjetoEquivocado[]): SolicitudMaestra => {
  const todosAprobados = items.every((item) => item.estado.includes('Aprobado'));
  const todosRechazados = items.every((item) => item.estado.includes('Rechazado') || item.estado === 'No Recibido');
  const algunFraude = items.some((item) => item.estado === 'Rechazado por Fraude');

  let nuevoEstado: EstadoMaestro = 'En Resolución Parcial';

  if (algunFraude) {
    nuevoEstado = 'En Resolución Parcial';
  } else if (todosAprobados) {
    nuevoEstado = 'Pendiente de Reembolso';
  } else if (todosRechazados) {
    nuevoEstado = 'Rechazada por Inconsistencia Física';
  }

  return { ...solicitud, items, objetos_equivocados: objetos, estado: nuevoEstado };
};

export const procesarPago = (solicitud: SolicitudMaestra): SolicitudMaestra => {
  return { ...solicitud, estado: 'Finalizada con Éxito' };
};