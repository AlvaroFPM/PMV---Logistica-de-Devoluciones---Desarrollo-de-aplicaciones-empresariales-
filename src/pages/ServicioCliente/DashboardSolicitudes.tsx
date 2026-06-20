import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// Catálogo maestro para recuperar el precio de datos antiguos
const CATALOGO_PRECIOS: Record<string, number> = {
  'PROD-001': 650000,
  'PROD-002': 180000,
  'PROD-003': 120000,
};

interface ItemConPrecioOpcional {
  id: string;
  precio?: number;
  nombreProducto?: string;
  nombre?: string;
}

const obtenerPrecioSeguro = (item: ItemConPrecioOpcional) => {
  if (item.precio && item.precio > 0) return item.precio;
  if (CATALOGO_PRECIOS[item.id]) return CATALOGO_PRECIOS[item.id];
  return 0;
};

const calcularDiasSLA = (fechaCreacion: string) => {
  if (!fechaCreacion) return 7; // Defensa contra datos nulos
  const hoy = new Date();
  const creacion = new Date(fechaCreacion);
  const diferenciaDias = Math.floor((hoy.getTime() - creacion.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, 7 - diferenciaDias);
};

export default function DashboardSolicitudes() {
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();
  const [pestanaActiva, setPestanaActiva] = useState<'Pendiente' | 'Completado'>('Pendiente');

  const solicitudesPendientes = solicitudes.filter((solicitud) => solicitud.estado === 'Creada' || solicitud.estado === 'En Revisión');
  const solicitudesCompletadas = solicitudes.filter((solicitud) => solicitud.estado !== 'Creada' && solicitud.estado !== 'En Revisión');

  const solicitudesFiltradas = (pestanaActiva === 'Pendiente' ? solicitudesPendientes : solicitudesCompletadas)
    .sort((a, b) => {
      if (pestanaActiva === 'Pendiente') {
        return (a.diasParaExpirar ?? 999) - (b.diasParaExpirar ?? 999);
      }
      return (b.fechaCreacion || '').localeCompare(a.fechaCreacion || '');
    });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* ENCABEZADO */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Servicio al Cliente</h1>
        <p className="text-gray-500 mt-2">Gestiona y evalúa las solicitudes de garantía y retracto.</p>
      </div>

      {/* PESTAÑAS */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setPestanaActiva('Pendiente')}
          className={`py-3 px-6 text-sm font-medium transition-colors ${
            pestanaActiva === 'Pendiente'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg'
          }`}
        >
          Pendientes de Evaluación
          <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
            {solicitudesPendientes.length}
          </span>
        </button>
        <button
          onClick={() => setPestanaActiva('Completado')}
          className={`py-3 px-6 text-sm font-medium transition-colors ${
            pestanaActiva === 'Completado'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg'
          }`}
        >
          Evaluaciones Completadas
        </button>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-semibold">ID Solicitud</th>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Fecha</th>
              <th className="p-4 font-semibold">N° Ítems</th>
              <th className="p-4 font-semibold">Monto</th>
              <th className="p-4 font-semibold">Prioridad / SLA</th>
              <th className="p-4 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No hay solicitudes en esta bandeja. ¡Buen trabajo!
                </td>
              </tr>
            ) : (
              solicitudesFiltradas.map((solicitud) => {
                const diasParaExpirar = solicitud.diasParaExpirar ?? calcularDiasSLA(solicitud.fechaCreacion);
                const esUrgente = diasParaExpirar !== null && diasParaExpirar <= 1;
                const estaAlLimite = diasParaExpirar === 2;
                const totalItems = solicitud.items ? solicitud.items.length : 0;
                
                // Mapeo seguro de cliente y precio
                const nombreCliente = typeof solicitud.cliente === 'string' ? solicitud.cliente : solicitud.cliente?.nombre || 'Desconocido';
                const monto = solicitud.items ? solicitud.items.reduce((total, item) => total + obtenerPrecioSeguro(item), 0) : 0;

                return (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{solicitud.id}</td>
                    <td className="p-4 text-gray-700">{nombreCliente}</td>
                    <td className="p-4 text-gray-500 text-sm">{solicitud.fechaCreacion}</td>
                    <td className="p-4 text-gray-500 text-sm">{totalItems}</td>
                    <td className="p-4 text-gray-700 font-medium">${monto.toLocaleString('es-CL')}</td>
                    
                    <td className="p-4">
                      {pestanaActiva === 'Pendiente' ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          esUrgente ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                          estaAlLimite ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {esUrgente ? '🔥 Vence Hoy/Mañana' : 
                           estaAlLimite ? '⚠️ Cerca de vencer' : 
                           `⏳ Quedan ${diasParaExpirar ?? 0} días`}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Resuelta</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {pestanaActiva === 'Pendiente' ? (
                        <button
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-200 hover:border-blue-600"
                          onClick={() => navigate(`/servicio-cliente/${solicitud.id}`)}
                        >
                          Evaluar Caso
                        </button>
                      ) : (
                        <button
                          className="text-gray-500 hover:text-gray-700 underline text-sm font-medium"
                          onClick={() => navigate(`/servicio-cliente/resumen/${solicitud.id}`)}
                        >
                          Ver Resumen
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}