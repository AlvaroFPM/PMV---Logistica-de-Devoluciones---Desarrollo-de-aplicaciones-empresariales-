// src/store/seedData.ts
import type { SolicitudMaestra } from '../types/devolucion';

export const solicitudesIniciales: SolicitudMaestra[] = [
  {
    id: 'DEV-2026-085',
    idOrdenCompra: 'OC-2026-771',
    fechaCreacion: '2026-05-20',
    estado: 'En Inspección Física',
    cliente: { nombre: 'Amaro', rut: '19.123.456-7', banco: 'Banco de Chile', cuenta: '123456789' },
    costoEnvioOriginal: 15000,
    objetos_equivocados: [],
    items: [
      { 
        id: 'PROD-001', 
        nombreProducto: 'Cámara Mirrorless Sony ZVE10', 
        precio: 650000, 
        motivo: 'Garantía', 
        descripcion: 'El sensor presenta pixeles muertos y líneas verticales en la pantalla.', 
        evidencia: 'sensor_falla.jpg', 
        estado: 'Pendiente', 
        n_serie: 'SN-ZVE10-9988' 
      },
      { 
        id: 'PROD-002', 
        nombreProducto: 'Raqueta Wilson Clash V2 100L', 
        precio: 180000, 
        motivo: 'Retracto', 
        descripcion: 'El peso no es el adecuado para el usuario, empaque sellado.', 
        evidencia: 'raqueta_sellada.jpg', 
        estado: 'Pendiente', 
        n_serie: 'SN-WLSN-4411' 
      }
    ]
  },
  {
    id: 'DEV-2026-042',
    idOrdenCompra: 'OC-2026-882',
    fechaCreacion: '2026-04-15',
    estado: 'Pendiente de Reembolso',
    cliente: { nombre: 'Amaro', rut: '19.123.456-7', banco: 'Banco de Chile', cuenta: '123456789' },
    costoEnvioOriginal: 15000,
    objetos_equivocados: [],
    items: [
      { 
        id: 'PROD-007', 
        nombreProducto: 'Tablet Apple iPad Air', 
        precio: 400000, 
        motivo: 'Garantía', 
        descripcion: 'Falla intermitente en el módulo Wi-Fi tras actualización.', 
        evidencia: 'ipad_wifi.jpg', 
        estado: 'Aprobado — Apto para Reacondicionamiento', 
        n_serie: 'SN-IPAD-7722' 
      }
    ]
  },
  {
    id: 'DEV-2026-090',
    idOrdenCompra: 'OC-2026-905',
    fechaCreacion: '2026-06-05',
    estado: 'En Revisión',
    cliente: { nombre: 'Amaro', rut: '19.123.456-7', banco: 'Banco de Chile', cuenta: '123456789' },
    costoEnvioOriginal: 15000,
    objetos_equivocados: [],
    items: [
      { 
        id: 'PROD-012', 
        nombreProducto: 'Consola PlayStation 5', 
        precio: 800000, 
        motivo: 'Retracto', 
        descripcion: 'Comprado por error, se solicita la restitución por insatisfacción comercial.', 
        evidencia: 'ps5_caja.jpg', 
        estado: 'Pendiente', 
        n_serie: 'SN-PS5-110022' 
      }
    ]
  }
];