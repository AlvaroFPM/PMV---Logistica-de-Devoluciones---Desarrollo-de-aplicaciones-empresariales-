import type { SolicitudMaestra, ItemMaestro } from '../types/devolucion';

export function obtenerPrecioSeguro(item: ItemMaestro): number {
  return typeof item.precio === 'number' ? item.precio : 0;
}

export function calcularMontoReembolso(solicitud: SolicitudMaestra): number {
  if (!solicitud || !solicitud.items) return 0;

  const itemsAprobados = solicitud.items.filter((i) => i.estado.includes('Aprobado'));

  // 1. Suma del precio de los productos
  let montoTotal = itemsAprobados.reduce((total, item) => total + obtenerPrecioSeguro(item), 0);

  // 2. Suma del costo de envío proporcional según el motivo (Caso 10)
  const costoEnvioOriginal = solicitud.costoEnvioOriginal || 0;
  const totalProductosOrden = solicitud.totalProductosOrden || 1; // Fallback a 1 para evitar NaN o Infinity
  const costoEnvioPorItem = costoEnvioOriginal / totalProductosOrden;

  itemsAprobados.forEach(item => {
    // Si el motivo fue Garantía o Error de la empresa, se reembolsa su parte del envío
    if (item.motivo === 'Garantía' || item.motivo === 'Error de envío') {
      montoTotal += costoEnvioPorItem;
    }
    // Si es "Retracto", no se suma envío.
  });

  return Math.round(montoTotal); // Redondear para evitar decimales en la moneda local
}
