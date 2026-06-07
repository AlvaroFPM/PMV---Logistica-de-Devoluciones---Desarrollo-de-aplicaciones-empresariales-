// src/pages/Cliente/DetalleSolicitud.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { BadgeEstado } from '../../components/BadgeEstado';
import type { SolicitudDevolucion, EstadoMaestro } from '../../types/devolucion';

// COMPONENTE AUXILIAR: Timeline de Progreso
const TimelineProgreso = ({ estadoActual }: { estadoActual: EstadoMaestro }) => {
  const pasos = ['Creada', 'En Revisión', 'Aprobada para Envío', 'En Tránsito', 'En Inspección Física'];
  const pasoActualIndex = pasos.indexOf(estadoActual) === -1 ? 5 : pasos.indexOf(estadoActual);

  return (
    <div className="w-full pt-4 pb-12 overflow-x-auto overflow-y-hidden">
      <div className="flex items-center min-w-max px-2">
        {pasos.map((paso, index) => {
          const completado = index < pasoActualIndex;
          const activo = index === pasoActualIndex;
          return (
            <div key={paso} className="flex items-center">
              <div className="flex flex-col items-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 
                  ${completado ? 'bg-blue-600 text-white' : activo ? 'bg-blue-100 text-blue-700 border-2 border-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                  {completado ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-2 font-medium absolute top-10 text-center w-24 -ml-8
                  ${completado || activo ? 'text-gray-900' : 'text-gray-400'}`}>
                  {paso}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div className={`h-1 w-16 md:w-24 mx-2 rounded ${completado ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function DetalleSolicitud() {
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const navigate = useNavigate();

  // LECTURA DESDE LA FUENTE ÚNICA DE VERDAD (localStorage)
  const dataLocal = localStorage.getItem('solicitudes_devolucion');
  const historial: SolicitudDevolucion[] = dataLocal ? JSON.parse(dataLocal) : [];
  
  // Buscamos la solicitud específica
  const solicitud = historial.find(s => s.id === idSolicitud) || null;

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold text-gray-800">Solicitud no encontrada</h2>
        <p className="text-gray-500 mt-2">El código de solicitud ingresado no existe o no tienes permisos para verlo.</p>
        <button onClick={() => navigate('/cliente/mis-devoluciones')} className="mt-4 text-blue-600 hover:underline font-medium">
          Volver a mis devoluciones
        </button>
      </div>
    );
  }

  const { id, idOrdenCompra, fechaCreacion, estado, items } = solicitud;
  const itemsAprobados = items.filter(i => i.estado.includes('Aprobado'));
  const montoAprobado = itemsAprobados.length * 25000;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera y Navegación */}
        <header className="flex justify-between items-end">
          <div>
            <button onClick={() => navigate('/cliente/mis-devoluciones')} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-3 flex items-center gap-1 transition-colors">
              <span>←</span> Volver a mis devoluciones
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Solicitud {id}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Orden Original: <span className="font-mono text-gray-700">{idOrdenCompra}</span> • Creada el {fechaCreacion}
            </p>
          </div>
          <div className="pb-1">
            <BadgeEstado estado={estado} />
          </div>
        </header>

        {/* Banner de Resolución Parcial (RN7) */}
        {estado === 'En Resolución Parcial' && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 text-orange-500">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">Resolución Mixta en Curso</h3>
                <div className="mt-1 text-sm text-orange-700">
                  <p>Tu solicitud contiene productos con diferentes resoluciones. El proceso general se mantendrá abierto hasta que se resuelva el estado de cada ítem individualmente.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Visual (Ya con el bug del scroll corregido) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Progreso de la Solicitud</h2>
          <TimelineProgreso estadoActual={estado} />
        </div>

        {/* Sección Desacoplada de Reembolsos (RN8) */}
        {itemsAprobados.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 p-5 rounded-xl shadow-sm flex justify-between items-center mt-8">
            <div>
              <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wider">Desglose Financiero Aprobado</h3>
              <p className="text-sm text-purple-700 mt-1">El reembolso de los ítems aprobados fluye de forma independiente.</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-black text-purple-700">${montoAprobado.toLocaleString('es-CL')}</span>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-1 inline-block">Pago en proceso</span>
            </div>
          </div>
        )}

        {/* Listado Maestro-Detalle */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mt-8 border-b pb-2">Detalle por Producto</h2>
          
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5">
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900">{item.nombreProducto}</h3>
                  <BadgeEstado estado={item.estado} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Motivo declarado</span>
                    {item.motivo}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Evidencia adjunta</span>
                    <span className="text-blue-600 truncate block font-mono text-xs">{item.evidencia}</span>
                  </div>
                </div>
              </div>

              {/* Lógica de renderizado defensivo por estado del ítem */}
              <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5">
                
                {item.estado === 'Rechazado por Fraude' ? (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-center h-full flex flex-col justify-center">
                    <span className="text-rose-600 text-xl mb-1">🔒</span>
                    <span className="text-xs font-bold text-rose-800 block mb-1">AUDITORÍA LEGAL</span>
                    <p className="text-[10px] text-rose-700 leading-tight">Ítem retenido por discrepancia en N° de serie. Derivado a Prevención de Fraudes.</p>
                  </div>
                ) : item.estado === 'Rechazado por Inconsistencia Física' ? (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex flex-col justify-between h-full">
                    <div className="text-center md:text-left">
                      <span className="text-red-700 font-bold text-xs uppercase tracking-wider block mb-1">Acción Requerida</span>
                      <p className="text-[11px] text-red-600 mb-2 leading-tight">Plazo para gestionar retorno: <strong className="text-red-800">15 días hábiles</strong>.</p>
                    </div>
                    <button className="w-full text-xs font-medium text-white bg-red-600 hover:bg-red-700 py-2 rounded shadow-sm transition-colors mt-auto">
                      Coordinar Retiro
                    </button>
                  </div>
                ) : item.estado.includes('Aprobado') ? (
                  <div className="text-center">
                     <span className="text-green-500 text-2xl block mb-1">✓</span>
                     <span className="text-sm font-medium text-gray-700">Aprobado para reembolso</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button className="w-full text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-red-600 py-2 rounded transition-colors">
                      Cancelar devolución
                    </button>
                  </div>
                )}
                
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}