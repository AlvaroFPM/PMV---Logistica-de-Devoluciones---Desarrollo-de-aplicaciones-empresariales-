import type { SolicitudMaestra } from '../types/devolucion';

export const solicitudesIniciales: SolicitudMaestra[] = [
  {
    id: 'DEV-2026-085',
    idOrdenCompra: 'OC-2026-771',
    fechaCreacion: '2026-05-20',
    estado: 'En Inspección Física',
    cliente: { nombre: 'Juan Pérez', rut: '19.123.456-7', banco: 'Banco de Chile', cuenta: '123456789' },
    costoEnvioOriginal: 15000,
    objetos_equivocados: [],
    items: [
      { id: 'ITM-001', nombreProducto: 'Samsung Galaxy S24+', precio: 850000, motivo: 'Garantía', descripcion: 'La pantalla presenta líneas y parpadea al encender.', evidencia: 'foto1.jpg', estado: 'Pendiente', n_serie: 'SN-998877' },
      { id: 'ITM-002', nombreProducto: 'Cargador 45W', precio: 45000, motivo: 'Retracto', descripcion: 'No fue utilizado y el cliente solicita devolución por retracto.', evidencia: 'foto2.jpg', estado: 'Pendiente', n_serie: 'N/A' }
    ]
  },
  {
    id: 'DEV-2026-042',
    idOrdenCompra: 'OC-2026-550',
    fechaCreacion: '2026-04-15',
    estado: 'Pendiente de Reembolso',
    cliente: { nombre: 'María González', rut: '18.987.654-3', banco: 'Santander', cuenta: '987654321' },
    costoEnvioOriginal: 5000,
    objetos_equivocados: [],
    items: [
      { id: 'ITM-003', nombreProducto: 'Teclado Mecánico', precio: 120000, motivo: 'Garantía', descripcion: 'Una de las teclas deja de responder de forma intermitente.', evidencia: 'teclado.jpg', estado: 'Aprobado — Apto para Reacondicionamiento', n_serie: 'KB-1122' }
    ]
  },
  {
    id: 'DEV-2026-090',
    idOrdenCompra: 'OC-2026-880',
    fechaCreacion: '2026-06-05',
    estado: 'En Revisión',
    cliente: { nombre: 'Ana Silva', rut: '17.444.333-2', banco: 'BCI', cuenta: '444333222' },
    costoEnvioOriginal: 8000,
    objetos_equivocados: [],
    items: [
      { id: 'ITM-004', nombreProducto: 'Raqueta Wilson', precio: 180000, motivo: 'Retracto', descripcion: 'El cliente compró por error el modelo y no lo ha usado.', evidencia: 'raqueta.jpg', estado: 'Pendiente', n_serie: 'RW-555' }
    ]
  }
];