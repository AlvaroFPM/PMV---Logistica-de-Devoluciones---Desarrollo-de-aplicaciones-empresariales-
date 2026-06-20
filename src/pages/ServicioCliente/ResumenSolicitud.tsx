import { useNavigate, useParams } from 'react-router-dom';
import { BadgeEstado } from '../../components/BadgeEstado';
import { useAppContext } from '../../context/AppContext';

const CATALOGO_PRECIOS: Record<string, number> = {
  'PROD-001': 650000,
  'PROD-002': 180000,
  'PROD-003': 120000,
};

const obtenerPrecioSeguro = (item: any) => {
  if (item.precio && item.precio > 0) return item.precio;
  if (CATALOGO_PRECIOS[item.id]) return CATALOGO_PRECIOS[item.id];
  return 0;
};

export default function ResumenSolicitud() {
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();
  const solicitud = solicitudes.find((item) => item.id === idSolicitud);

  if (!solicitud) {
    return <div className="p-6 text-gray-700">Solicitud no encontrada.</div>;
  }

  const nombreCliente = typeof solicitud.cliente === 'string' ? solicitud.cliente : solicitud.cliente?.nombre || 'Desconocido';
  const total = solicitud.items ? solicitud.items.reduce((acc, item) => acc + obtenerPrecioSeguro(item), 0) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate('/servicio-cliente')} className="text-sm text-blue-600 hover:underline">← Volver</button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Resumen de solicitud {solicitud.id}</h1>
        </div>
        <BadgeEstado estado={solicitud.estado} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
        <p><span className="font-semibold">Cliente:</span> {nombreCliente}</p>
        <p><span className="font-semibold">Orden:</span> {solicitud.idOrdenCompra}</p>
        <p><span className="font-semibold">Fecha:</span> {solicitud.fechaCreacion}</p>
        <p><span className="font-semibold">Total:</span> ${total.toLocaleString('es-CL')}</p>
        <div className="pt-4">
          <h2 className="font-semibold text-gray-800 mb-3">Items</h2>
          <div className="space-y-2">
            {solicitud.items && solicitud.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center rounded-lg border border-gray-200 px-4 py-3">
                <div className="flex flex-col">
                  {/* AQUÍ SE CORRIGE EL ERROR DE TYPESCRIPT */}
                  <span className="font-medium text-gray-800">{item.nombreProducto || (item as any).nombre || 'Producto'}</span>
                  <span className="text-sm font-bold text-gray-600">${obtenerPrecioSeguro(item).toLocaleString('es-CL')}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}