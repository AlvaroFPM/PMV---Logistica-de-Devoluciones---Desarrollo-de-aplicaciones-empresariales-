import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { calcularMontoReembolso } from '../../utils/reembolso';

export default function BandejaPagos() {
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();

  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [orden, setOrden] = useState<string>('fecha-asc');

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bandeja de Reembolsos</h1>
          <p className="text-gray-500 text-sm">Finanzas y Liberación de Pagos Bancarios</p>
        </div>

        <div className="flex gap-3">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente de Reembolso">Pendiente de Reembolso</option>
            <option value="En Resolución Parcial">En Resolución Parcial</option>
          </select>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="fecha-asc">SLA: Más antiguos primero</option>
            <option value="fecha-desc">SLA: Más nuevos primero</option>
            <option value="id-asc">ID Solicitud</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-500 tracking-wider">
              <th className="p-4">ID Solicitud</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Estado Interno</th>
              <th className="p-4">Vencimiento / SLA</th>
              <th className="p-4 text-right">Monto Estimado</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solicitudesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No hay pagos pendientes de procesar en este momento.
                </td>
              </tr>
            ) : (
              solicitudesFiltradas.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-gray-900">{sol.id}</td>
                  <td className="p-4 text-gray-700">{sol.cliente?.nombre || 'Cliente'}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sol.estado === 'Pendiente de Reembolso' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                      {sol.estado}
                    </span>
                  </td>
                  <td className="p-4">
                    {sol.diasParaExpirar !== undefined && sol.diasParaExpirar !== null ? (
                      sol.diasParaExpirar <= 1 ? (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-sm animate-pulse">
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
                      <span className="text-gray-400 text-sm">⏳ Quedan 5 días</span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-gray-800 text-right">
                    ${calcularMontoReembolso(sol).toLocaleString('es-CL')}
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