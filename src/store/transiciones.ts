import type { SolicitudMaestra, ItemMaestro, ObjetoEquivocado, EstadoMaestro } from '../types/devolucion';

export const evaluarPorServicioCliente = (solicitud: SolicitudMaestra, decisiones: Record<string, string>): SolicitudMaestra => {
  const valoresDecisiones = Object.values(decisiones);
  
  const todosRechazados = valoresDecisiones.every(d => d.includes('Rechazar'));
  const todosAprobados = valoresDecisiones.every(d => d.includes('Aprobado'));
  const esMixto = !todosRechazados && !todosAprobados;

  let nuevoEstado: EstadoMaestro;

  if (todosRechazados) {
    nuevoEstado = 'Cancelada — Rechazo Documental';
  } else if (esMixto) {
    nuevoEstado = 'En Resolución Parcial';
  } else {
    nuevoEstado = 'Aprobada para Envío';
  }

  // CORRECCIÓN 1: Guardamos el veredicto en cada ítem para que Bodega sepa cuáles no recibirá
  const itemsActualizados = solicitud.items.map(item => {
    const decision = decisiones[item.id];
    let nuevoEstadoItem = item.estado;
    
    if (decision && decision.includes('Rechazar')) {
      // Marcamos forzosamente para que no pase al Inspector
      nuevoEstadoItem = 'Rechazado en Revisión Documental' as any; 
    }
    
    return { ...item, estado: nuevoEstadoItem };
  });

  return {
    ...solicitud,
    estado: nuevoEstado,
    items: itemsActualizados
  };
};

export const finalizarInspeccionFisica = (solicitud: SolicitudMaestra, items: ItemMaestro[], objetos: ObjetoEquivocado[]): SolicitudMaestra => {
  const algunFraude = items.some(i => i.estado === 'Rechazado por Fraude');
  const algunAprobadoFisico = items.some(i => i.estado.includes('Aprobado'));
  const todosRechazados = items.every(i => i.estado.includes('Rechazado') || i.estado === 'No Recibido');

  let nuevoEstado: EstadoMaestro = 'En Resolución Parcial'; 
  
  if (algunFraude) {
    nuevoEstado = 'En Resolución Parcial'; 
  } else if (algunAprobadoFisico) {
    nuevoEstado = 'Pendiente de Reembolso';
  } else if (todosRechazados) {
    nuevoEstado = 'Rechazada por Inconsistencia Física';
  }

  return { ...solicitud, items, objetos_equivocados: objetos, estado: nuevoEstado };
};

export const procesarPago = (solicitud: SolicitudMaestra): SolicitudMaestra => {
  return { ...solicitud, estado: 'Finalizada con Éxito' };
};