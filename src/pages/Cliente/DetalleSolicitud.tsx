import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeEstado } from '../../components/BadgeEstado';
import { useAppContext } from '../../context/AppContext';
import type { EstadoMaestro } from '../../types/devolucion';

// Catálogo maestro de respaldo (Evita el bug del monto a $0 en datos viejos)
const CATALOGO_PRECIOS: Record<string, number> = {
  'PROD-001': 650000,
  'PROD-002': 180000,
  'PROD-003': 120000,
  'PROD-004': 500000,
  'PROD-005': 200000,
  'PROD-006': 250000,
  'PROD-007': 400000,
  'PROD-008': 1200000,
  'PROD-009': 350000,
  'PROD-010': 150000,
  'PROD-011': 90000,
  'PROD-012': 800000,
  'PROD-013': 700000,
  'PROD-014': 300000,
  'PROD-015': 50000
};

interface ItemConPrecioOpcional {
  id: string;
  precio?: number;
  nombreProducto?: string;
  nombre?: string;
}

const TimelineProgreso = ({ estadoActual }: { estadoActual: EstadoMaestro }) => {
  const pasos = ['Creada', 'En Revisión', 'Aprobada para Envío', 'En Tránsito', 'En Inspección Física'];
  const pasoActualIndex = pasos.indexOf(estadoActual) === -1 ? 5 : pasos.indexOf(estadoActual);

  return (
    <div className="w-full pt-4 pb-12 overflow-x-auto overflow-y-hidden">
      <div className="flex items-center min-w-max px-10">
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
                <span className={`text-xs mt-2 font-medium absolute top-10 text-center w-24 left-1/2 -translate-x-1/2
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
  const { solicitudes, cancelarSolicitud, actualizarDatosBancarios, enviarAInspeccionFisica } = useAppContext();
  const solicitud = solicitudes.find((s) => s.id === idSolicitud) || null;
  const [banco, setBanco] = useState(() => solicitud?.cliente.banco ?? '');
  const [cuenta, setCuenta] = useState(() => solicitud?.cliente.cuenta ?? '');
  const [rut, setRut] = useState(() => solicitud?.cliente.rut ?? '');

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

  const { id, idOrdenCompra, fechaCreacion, estado, items, cliente, costoEnvioOriginal } = solicitud;
  const puedeCancelar = estado === 'Creada' || estado === 'En Revisión';
  const puedeEnviarAInspeccion = estado === 'En Tránsito';
  
  // Función para obtener el precio real sin importar si el localStorage falló
  const obtenerPrecioSeguro = (item: ItemConPrecioOpcional) => {
    if (item.precio && item.precio > 0) return item.precio;
    if (CATALOGO_PRECIOS[item.id]) return CATALOGO_PRECIOS[item.id];
    return 0; 
  };

  const itemsAprobados = items.filter((item) => item.estado.includes('Aprobado'));
  const montoAprobado = itemsAprobados.reduce((total, item) => total + obtenerPrecioSeguro(item), 0);
  const requiereDatosBancarios = estado === 'Pendiente de Reembolso';
  const datosBancariosCompletos = banco.trim() !== '' && cuenta.trim() !== '' && rut.trim() !== '';

  const guardarDatosBancarios = () => {
    if (!datosBancariosCompletos) {
      alert('Completa el banco, el número de cuenta y el RUT para continuar.');
      return;
    }
    actualizarDatosBancarios(id, rut.trim(), banco.trim(), cuenta.trim());
    alert('Los datos bancarios quedaron guardados para el ejecutivo de pagos.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Progreso de la Solicitud</h2>
          <TimelineProgreso estadoActual={estado} />
        </div>

        {puedeEnviarAInspeccion && (
          <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-sky-800 uppercase tracking-wider">Envío en tránsito</h3>
              <p className="text-sm text-sky-700 mt-1">Cuando el paquete ya llegó, puedes simular el pase a inspección física para habilitar la revisión de calidad.</p>
            </div>
            <button
              onClick={() => {
                enviarAInspeccionFisica(id);
                alert('La solicitud pasó a En Inspección Física.');
              }}
              className="whitespace-nowrap rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 shadow-sm"
            >
              Enviar a inspección física
            </button>
          </div>
        )}

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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mt-8 border-b pb-2">Detalle por Producto</h2>
          
          {items.map((item) => {
            const precioSeguro = obtenerPrecioSeguro(item);
            
            return (
              <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">{item.nombreProducto}</h3>
                        {/* AHORA MOSTRAMOS EL PRECIO DEL ÍTEM */}
                        <p className="text-sm font-bold text-gray-600 mt-0.5">${precioSeguro.toLocaleString('es-CL')}</p>
                    </div>
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
                      <button
                        onClick={() => {
                          cancelarSolicitud(id);
                          alert('La devolución fue cancelada.');
                          navigate('/cliente/mis-devoluciones');
                        }}
                        disabled={!puedeCancelar}
                        className={`w-full text-xs font-medium py-2 rounded transition-colors border ${puedeCancelar ? 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-red-600' : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed opacity-70'}`}
                      >
                        Cancelar devolución
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            );
          })}
        </div>

        {requiereDatosBancarios && (
          <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider">Datos bancarios para reembolso</h3>
              <p className="text-sm text-gray-600 mt-1">Completa esta información para que el ejecutivo de pagos pueda transferir el dinero correctamente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Banco
                <input
                  type="text"
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Banco de Chile"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Número de cuenta
                <input
                  type="text"
                  value={cuenta}
                  onChange={(e) => setCuenta(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 123456789"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                RUT
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 123456789"
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <span className="text-xs text-gray-500">Estos datos se usarán luego en la vista de pagos.</span>
              <button
                type="button"
                onClick={guardarDatosBancarios}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Guardar datos bancarios
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Datos del cliente</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p><span className="font-semibold">Nombre:</span> {cliente.nombre}</p>
            <p><span className="font-semibold">RUT:</span> {cliente.rut}</p>
            <p><span className="font-semibold">Banco:</span> {cliente.banco}</p>
            <p><span className="font-semibold">Cuenta:</span> {cliente.cuenta}</p>
            <p><span className="font-semibold">Costo envío original:</span> ${costoEnvioOriginal.toLocaleString('es-CL')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}