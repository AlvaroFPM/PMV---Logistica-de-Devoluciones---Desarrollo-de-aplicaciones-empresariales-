import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

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
  'PROD-015': 100000,
};

interface ItemConPrecioOpcional {
  id: string;
  precio?: number;
}

export default function ProcesarPago() {
  const navigate = useNavigate();
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const { solicitudes, pagarSolicitud } = useAppContext();
  const solicitud = solicitudes.find((item) => item.id === idSolicitud);
  
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [numeroTransaccion, setNumeroTransaccion] = useState('');

  useEffect(() => {
    if (solicitud) {
      const aprobados = solicitud.items
        .filter(i => i.estado.includes('Aprobado'))
        .map(i => i.id);
      setSeleccionados(aprobados);
    }
  }, [solicitud]);

  if (!solicitud) {
    return <div className="p-6 text-gray-700">Solicitud no encontrada.</div>;
  }

  const obtenerPrecioSeguro = (item: ItemConPrecioOpcional) => {
    if (item.precio && item.precio > 0) return item.precio;
    if (CATALOGO_PRECIOS[item.id]) return CATALOGO_PRECIOS[item.id];
    return 0;
  };

  const esDatoInvalido = (dato: string | undefined) => {
    if (!dato) return true;
    const limpio = dato.trim().toLowerCase();
    return limpio === '' || limpio === 'n/a' || limpio === 'pendiente';
  };

  const datosBancariosCompletos = 
    !esDatoInvalido(solicitud.cliente.rut) && 
    !esDatoInvalido(solicitud.cliente.banco) && 
    !esDatoInvalido(solicitud.cliente.cuenta);

  // CORRECCIÓN: Filtramos la lista para aislar solo los productos aprobados a reembolsar
  const itemsPagables = solicitud.items.filter(item => item.estado.includes('Aprobado'));

  const puedePagar = seleccionados.length > 0 && numeroTransaccion.trim() !== '' && datosBancariosCompletos;

  // Calculamos el subtotal basándonos solo en los ítems pagables seleccionados
  const subtotal = itemsPagables
    .filter((item) => seleccionados.includes(item.id))
    .reduce((acc, item) => acc + obtenerPrecioSeguro(item), 0);

  const esGarantia = solicitud.items.every(i => i.motivo === 'Garantía' || i.motivo.includes('Falla'));
  // La devolución total se evalúa contra la solicitud completa (no contra lo pagable) para la regla de envío
  const esDevolucionTotal = seleccionados.length === solicitud.items.length;
  const aplicaEnvio = esGarantia && esDevolucionTotal;
  
  const total = subtotal + (aplicaEnvio ? solicitud.costoEnvioOriginal : 0);

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const ejecutarPago = () => {
    pagarSolicitud(solicitud.id);
    alert('¡Pago registrado exitosamente en el sistema!');
    navigate('/ejecutivo-pagos');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Módulo de Pagos y Reembolsos</h1>
        <button onClick={() => navigate('/ejecutivo-pagos')} className="px-3 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
          ← Volver a la bandeja
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Ítems a Reembolsar (Solicitud: {solicitud.id})</h2>

            {itemsPagables.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded border border-gray-200">
                No hay productos aprobados para reembolsar en esta solicitud.
              </div>
            ) : (
              <div className="space-y-3">
                {itemsPagables.map((item) => (
                  <label key={item.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${seleccionados.includes(item.id) ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300 hover:border-blue-300 cursor-pointer'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={seleccionados.includes(item.id)}
                        onChange={() => toggleSeleccion(item.id)}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.nombreProducto}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.estado.includes('Aprobado') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.estado}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-700">${obtenerPrecioSeguro(item).toLocaleString('es-CL')}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-blue-900 text-white p-5 rounded-lg shadow-sm relative">
            <h3 className="text-sm uppercase text-blue-200 font-bold mb-3 tracking-wider">Datos de Transferencia</h3>
            
            {!datosBancariosCompletos && (
              <div className="mb-4 bg-red-500/20 border border-red-400 text-red-100 px-3 py-2 rounded text-xs font-medium flex items-start gap-2">
                <span>⚠️</span>
                <span>Faltan los datos bancarios del cliente. Debes esperar a que los actualice para poder pagar.</span>
              </div>
            )}

            <p className="font-semibold text-lg">{solicitud.cliente?.nombre || 'Cliente'}</p>
            <p className={`text-sm mt-1 ${esDatoInvalido(solicitud.cliente?.rut) ? 'text-red-300 font-bold' : 'text-blue-100'}`}>
              RUT: {solicitud.cliente?.rut}
            </p>
            <div className="mt-4 p-3 bg-blue-800 rounded">
              <p className="text-xs text-blue-200">Banco Destino</p>
              <p className={`font-medium ${esDatoInvalido(solicitud.cliente?.banco) ? 'text-red-300' : ''}`}>
                {solicitud.cliente?.banco}
              </p>
              <p className="text-xs text-blue-200 mt-2">N° Cuenta</p>
              <p className={`font-medium ${esDatoInvalido(solicitud.cliente?.cuenta) ? 'text-red-300' : ''}`}>
                {solicitud.cliente?.cuenta}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Liquidación</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal Ítems ({seleccionados.length})</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Costo de Envío Original</span>
                {aplicaEnvio ? (
                  <span className="text-green-600 font-medium">+ ${solicitud.costoEnvioOriginal.toLocaleString('es-CL')}</span>
                ) : (
                  <div className="text-right">
                    <span className="line-through text-gray-400 mr-2">${solicitud.costoEnvioOriginal.toLocaleString('es-CL')}</span>
                    <span className="text-red-500 text-xs font-bold block">
                      (No aplica: {esGarantia ? 'Devolución parcial' : 'Retracto'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 mb-6">
              <span className="font-bold text-gray-800 text-lg">Total a Transferir</span>
              <span className="font-bold text-blue-600 text-2xl">${total.toLocaleString('es-CL')}</span>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">N° Transacción Bancaria *</label>
              <input
                type="text"
                placeholder="Ej: TR-8849201"
                disabled={!datosBancariosCompletos}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={numeroTransaccion}
                onChange={(e) => setNumeroTransaccion(e.target.value)}
              />
            </div>

            <button
              disabled={!puedePagar}
              onClick={ejecutarPago}
              className={`w-full py-3 rounded-lg font-bold transition-all ${puedePagar ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {!datosBancariosCompletos ? 'ESPERANDO DATOS' : 'REGISTRAR PAGO'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}