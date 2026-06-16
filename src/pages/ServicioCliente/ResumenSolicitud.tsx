import { useNavigate, useParams } from 'react-router-dom';
import { BadgeEstado } from '../../components/BadgeEstado';
import { useAppContext } from '../../context/AppContext';

export default function ResumenSolicitud() {
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const navigate = useNavigate();
  const { solicitudes } = useAppContext();
  const solicitud = solicitudes.find((item) => item.id === idSolicitud);

  if (!solicitud) {
    return <div className="p-6 text-gray-700">Solicitud no encontrada.</div>;
  }

  const total = solicitud.items.reduce((acc, item) => acc + item.precio, 0);

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
        <p><span className="font-semibold">Cliente:</span> {solicitud.cliente.nombre}</p>
        <p><span className="font-semibold">Orden:</span> {solicitud.idOrdenCompra}</p>
        <p><span className="font-semibold">Fecha:</span> {solicitud.fechaCreacion}</p>
        <p><span className="font-semibold">Total:</span> ${total.toLocaleString('es-CL')}</p>
        <div className="pt-4">
          <h2 className="font-semibold text-gray-800 mb-3">Items</h2>
          <div className="space-y-2">
            {solicitud.items.map((item) => (
              <div key={item.id} className="flex justify-between rounded-lg border border-gray-200 px-4 py-3">
                <span>{item.nombreProducto}</span>
                <span className="text-sm text-gray-500">{item.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}