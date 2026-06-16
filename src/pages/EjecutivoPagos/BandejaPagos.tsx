import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function BandejaPagos() {
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();
  
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [orden, setOrden] = useState<string>('fecha-asc'); // fecha-asc, fecha-desc, id-asc

  const pendientesGlobales = solicitudes.filter((solicitud) => solicitud.estado === 'Pendiente de Reembolso' || solicitud.estado === 'En Resolución Parcial');

  const solicitudesFiltradas = pendientesGlobales
    .filter((sol) => filtroEstado === 'Todos' || sol.estado === filtroEstado)
    .sort((a, b) => {
      if (orden === 'fecha-asc') return (a.diasParaExpirar ?? 999) - (b.diasParaExpirar ?? 999);
      if (orden === 'fecha-desc') return (b.diasParaExpirar ?? 999) - (a.diasParaExpirar ?? 999);
      if (orden === 'id-asc') return a.id.localeCompare(b.id);
      return 0;
    });

  const irAlDetalle = (id: string) => {
    navigate(`/ejecutivo-pagos/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Bandeja de Reembolsos Pendientes</h1>
      <p className="text-gray-500 mb-8">Gestione los pagos aprobados por el Inspector y Servicio al Cliente.</p>

      {/* BARRA DE HERRAMIENTAS (Filtros y Ordenamiento) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-semibold text-gray-700">Filtrar por Estado:</label>
          <select 
            className="border border-gray-300 rounded p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los pendientes</option>
            <option value="Pendiente de Reembolso">Pendiente de Reembolso</option>
            <option value="En Resolución Parcial">En Resolución Parcial</option>
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <label className="text-sm font-semibold text-gray-700">Ordenar por:</label>
          <select 
            className="border border-gray-300 rounded p-2 text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="fecha-asc">Más recientes primero</option>
            <option value="fecha-desc">Más antiguos (Urgentes) primero</option>
            <option value="id-asc">ID de Solicitud (A-Z)</option>
          </select>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">ID Solicitud</th>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Estado de Pago</th>
              <th className="p-4 font-semibold">Tiempo en Espera</th>
              <th className="p-4 font-semibold text-right">Monto Estimado</th>
              <th className="p-4 font-semibold text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No hay solicitudes que coincidan con los filtros.</td>
              </tr>
            ) : (
              solicitudesFiltradas.map(sol => (
                <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{sol.id}</td>
                  <td className="p-4 text-gray-700">{sol.cliente.nombre}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sol.estado === 'Pendiente de Reembolso' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {sol.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    {sol.diasParaExpirar !== null && sol.diasParaExpirar !== undefined ? (
                      sol.diasParaExpirar <= 1 ? (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
                          ⚠️ {sol.diasParaExpirar} días (Crítico)
                        </span>
                      ) : sol.diasParaExpirar <= 3 ? (
                        <span className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                          ⏳ {sol.diasParaExpirar} días (Alerta)
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium text-sm">
                          {sol.diasParaExpirar} días (A tiempo)
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Sin SLA definido
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-gray-800 text-right">
                    ${sol.items.reduce((total, item) => total + item.precio, 0).toLocaleString('es-CL')}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => irAlDetalle(sol.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors shadow-sm"
                    >
                      Procesar Pago
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}