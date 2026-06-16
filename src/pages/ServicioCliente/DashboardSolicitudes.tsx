import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Simulamos una base de datos de solicitudes
const solicitudesDB = [
  { id: 'SOL-8891', cliente: 'María López', fechaSolicitud: '2026-06-01', items: 1, estado: 'Pendiente', diasParaExpirar: 0, monto: '$150.000' }, // ¡A punto de expirar!
  { id: 'SOL-8890', cliente: 'Juan Pérez', fechaSolicitud: '2026-06-03', items: 2, estado: 'Pendiente', diasParaExpirar: 2, monto: '$850.000' },
  { id: 'SOL-8893', cliente: 'Ana Silva', fechaSolicitud: '2026-06-02', items: 1, estado: 'Pendiente', diasParaExpirar: 5, monto: '$45.000' },
  { id: 'SOL-8892', cliente: 'Carlos Ruiz', fechaSolicitud: '2026-05-28', items: 3, estado: 'Completado', diasParaExpirar: null, monto: '$1.200.000' },
  { id: 'SOL-8894', cliente: 'Pedro Gómez', fechaSolicitud: '2026-05-25', items: 1, estado: 'Completado', diasParaExpirar: null, monto: '$30.000' },
];

export default function DashboardSolicitudes() {
  const navigate = useNavigate();
  // Estado para controlar qué pestaña está activa
  const [pestanaActiva, setPestanaActiva] = useState<'Pendiente' | 'Completado'>('Pendiente');

  // 2. Lógica de Filtrado y Ordenamiento
  const solicitudesFiltradas = solicitudesDB
    .filter(solicitud => solicitud.estado === pestanaActiva)
    .sort((a, b) => {
      // Si estamos en pendientes, ordenamos de menor a mayor días para expirar (los más urgentes primero)
      if (pestanaActiva === 'Pendiente') {
        return (a.diasParaExpirar ?? 999) - (b.diasParaExpirar ?? 999);
      }
      // Si son completados, ordenamos por fecha (simulado aquí de forma sencilla)
      return b.id.localeCompare(a.id); 
    });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      
      {/* ENCABEZADO */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Servicio al Cliente</h1>
        <p className="text-gray-500 mt-2">Gestiona y evalúa las solicitudes de garantía y retracto.</p>
      </div>

      {/* PESTAÑAS (TABS) */}
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
            {solicitudesDB.filter(s => s.estado === 'Pendiente').length}
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
                // Lógica visual para la urgencia
                const esUrgente = solicitud.diasParaExpirar !== null && solicitud.diasParaExpirar <= 1;
                const estaAlLimite = solicitud.diasParaExpirar === 2;

                return (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{solicitud.id}</td>
                    <td className="p-4 text-gray-700">{solicitud.cliente}</td>
                    <td className="p-4 text-gray-500 text-sm">{solicitud.fechaSolicitud}</td>
                    <td className="p-4 text-gray-500 text-sm">{solicitud.items}</td>
                    <td className="p-4 text-gray-700 font-medium">{solicitud.monto}</td>
                    
                    {/* COLUMNA DE SLA / URGENCIA */}
                    <td className="p-4">
                      {pestanaActiva === 'Pendiente' ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          esUrgente ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                          estaAlLimite ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {esUrgente ? '🔥 Vence Hoy/Mañana' : 
                           estaAlLimite ? '⚠️ Cerca de vencer' : 
                           `⏳ Quedan ${solicitud.diasParaExpirar} días`}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Resuelta</span>
                      )}
                    </td>

                    {/* BOTÓN DE ACCIÓN */}
                    <td className="p-4 text-right">
                      {pestanaActiva === 'Pendiente' ? (
                        <button
                          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors border border-blue-200 hover:border-blue-600"
                          onClick={() => navigate(`/servicio-cliente/${solicitud.id}`)}
                        >
                          Evaluar Caso
                        </button>
                      ) : (
                        <button className="text-gray-500 hover:text-gray-700 underline text-sm font-medium">
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