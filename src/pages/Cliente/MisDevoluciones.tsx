// src/pages/Cliente/MisDevoluciones.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeEstado } from '../../components/BadgeEstado';
import type { SolicitudDevolucion } from '../../types/devolucion';

// MOCK INICIAL: Para que el profesor vea datos la primera vez que abre la app
const mockInicial: SolicitudDevolucion[] = [
  {
    id: 'DEV-2026-085',
    idOrdenCompra: 'OC-2026-771',
    fechaCreacion: '2026-05-20',
    estado: 'En Resolución Parcial',
    items: []
  },
  {
    id: 'DEV-2026-042',
    idOrdenCompra: 'OC-2026-550',
    fechaCreacion: '2026-04-15',
    estado: 'Finalizada con Éxito',
    items: []
  }
];

export default function MisDevoluciones() {
  const navigate = useNavigate();
  const [historialSolicitudes, setHistorialSolicitudes] = useState<SolicitudDevolucion[]>([]);

  // Efecto para cargar los datos persistidos al montar el componente
  useEffect(() => {
    const dataLocal = localStorage.getItem('solicitudes_devolucion');
    if (dataLocal) {
      // Si hay datos, los cargamos
      setHistorialSolicitudes(JSON.parse(dataLocal));
    } else {
      // Si no hay datos (primera vez), guardamos el mock inicial y lo mostramos
      localStorage.setItem('solicitudes_devolucion', JSON.stringify(mockInicial));
      setHistorialSolicitudes(mockInicial);
    }
  }, []);

  if (historialSolicitudes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes solicitudes</h2>
          <p className="text-gray-500 text-sm mb-6">
            Cuando inicies un proceso de devolución o garantía, podrás hacer el seguimiento detallado desde aquí.
          </p>
          <button 
            onClick={() => navigate('/cliente/crear-solicitud')}
            className="w-full px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Iniciar Nueva Devolución
          </button>
        </div>
      </div>
    );
  }

  // Ordenamos el historial para que las solicitudes más nuevas salgan primero
  const historialOrdenado = [...historialSolicitudes].reverse();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Devoluciones</h1>
            <p className="text-gray-500 text-sm mt-1">Historial y seguimiento de tus solicitudes</p>
          </div>
          <button 
            onClick={() => navigate('/cliente/crear-solicitud')}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            + Nueva Devolución
          </button>
        </header>

        <div className="space-y-4 mt-6">
          {historialOrdenado.map((solicitud) => (
            <div 
              key={solicitud.id} 
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{solicitud.id}</h3>
                  <BadgeEstado estado={solicitud.estado} />
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4 mt-2">
                  <span>📅 Creada: {solicitud.fechaCreacion}</span>
                  <span>🛒 Orden: <span className="font-mono">{solicitud.idOrdenCompra}</span></span>
                </div>
              </div>
              
              <div className="sm:text-right mt-3 sm:mt-0">
                <button 
                  onClick={() => navigate(`/cliente/devoluciones/${solicitud.id}`)}
                  className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Ver Detalles →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}