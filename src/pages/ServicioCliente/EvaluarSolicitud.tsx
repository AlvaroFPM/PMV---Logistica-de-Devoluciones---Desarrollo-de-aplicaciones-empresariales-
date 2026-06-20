import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function EvaluarSolicitud() {
  const navigate = useNavigate();
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const { solicitudes, evaluarSolicitud } = useAppContext();
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  const [decisiones, setDecisiones] = useState<Record<string, string>>({});
  const solicitud = solicitudes.find((item) => item.id === idSolicitud);

  if (!solicitud) {
    return <div className="p-6 text-gray-700">Solicitud no encontrada.</div>;
  }

  const solicitudId = idSolicitud ?? solicitud.id;

  const toggleExpandir = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  const manejarDecision = (itemId: string, decision: string) => {
    setDecisiones(prev => ({ ...prev, [itemId]: decision }));
  };

  const itemsEvaluados = Object.keys(decisiones).length;
  const totalItems = solicitud.items.length;
  const faltan = totalItems - itemsEvaluados;
  const listoParaConfirmar = faltan === 0;

  const enviarEvaluacion = () => {
    if (!listoParaConfirmar) return;

    evaluarSolicitud(solicitud.id, decisiones);
    alert('¡Evaluación enviada con éxito!');
    navigate('/servicio-cliente');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen relative">
      {/* Botón volver a la lista */}
      <div className="mb-4">
        <button onClick={() => navigate('/servicio-cliente')} className="text-sm text-blue-600 hover:underline">← Volver</button>
      </div>
      
      {/* HEADER DE LA SOLICITUD */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Solicitud: {solicitudId}</h1>
            <p className="text-gray-500 mt-1">Cliente: {solicitud.cliente.nombre}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-md">Fecha Solicitud: {solicitud.fechaCreacion}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-md">Orden: {solicitud.idOrdenCompra}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Orden</p>
          <p className="text-2xl font-bold text-blue-600">${solicitud.items.reduce((acc, item) => acc + item.precio, 0).toLocaleString('es-CL')}</p>
        </div>
      </div>

      {/* LISTA DE ÍTEMS */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between">
        <span>Ítems a Evaluar</span>
        {faltan > 0 && <span className="text-orange-500 text-sm bg-orange-100 px-2 py-1 rounded font-medium">Faltan {faltan} por evaluar</span>}
      </h2>

      <div className="space-y-4">
        {solicitud.items.map(item => {
          const garantiaValida = true;
          const estaExpandido = itemExpandido === item.id;
          
          return (
            <div key={item.id} className={`bg-white rounded-lg shadow-sm border transition-all ${decisiones[item.id] ? 'border-green-400' : 'border-gray-200'} overflow-hidden`}>
              
              {/* BOX HORIZONTAL PRINCIPAL */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl">📦</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.nombreProducto}</h3>
                    <p className="text-sm text-gray-500">Motivo: <span className="font-medium text-gray-700">{item.motivo}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {garantiaValida ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200">
                      Validado
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium border border-red-200">
                      Expirado
                    </span>
                  )}
                  
                  <p className="font-semibold text-gray-700 w-24 text-right">${item.precio.toLocaleString('es-CL')}</p>
                  
                  <button 
                    onClick={() => toggleExpandir(item.id)}
                    className="text-blue-600 text-sm font-semibold hover:underline w-24 text-right cursor-pointer"
                  >
                    {estaExpandido ? 'Ocultar ▲' : 'Ver Detalle ▼'}
                  </button>
                </div>
              </div>

              {/* DETALLE EXPANDIDO */}
              {estaExpandido && (
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1.05fr_0.9fr] gap-6 items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Descripción del cliente</p>
                      <div className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-700 min-h-[180px] flex items-start">
                        <p className="leading-6 whitespace-pre-line">{item.descripcion || item.motivo}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Evidencia fotográfica</p>
                      <div className="bg-white p-4 rounded border border-gray-200 overflow-hidden min-h-[180px] flex flex-col justify-center items-center">
                        <img
                          src={item.evidencia.startsWith('http') || item.evidencia.startsWith('data:') ? item.evidencia : `https://placehold.co/640x360?text=${encodeURIComponent(item.evidencia || 'Evidencia')}`}
                          alt={`Evidencia de ${item.nombreProducto}`}
                          className="w-full max-h-48 object-cover rounded"
                        />
                      </div>
                    </div>

                    <div className="xl:border-l border-gray-200 xl:pl-6 flex flex-col justify-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Decisión Documental</p>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => manejarDecision(item.id, 'Aprobado')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Aprobado' ? 'bg-green-50 border-green-500 text-green-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>✅ Aprobar Envío</button>
                        <button onClick={() => manejarDecision(item.id, 'Rechazar Documento')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Rechazar Documento' ? 'bg-red-50 border-red-500 text-red-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>❌ Rechazar (Falta Evidencia)</button>
                        <button onClick={() => manejarDecision(item.id, 'Rechazar Políticas')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Rechazar Políticas' ? 'bg-red-50 border-red-500 text-red-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>❌ Rechazar (Políticas/Garantía)</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={enviarEvaluacion}
          disabled={!listoParaConfirmar}
          className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${listoParaConfirmar ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {listoParaConfirmar ? 'CONFIRMAR EVALUACIÓN' : 'EVALÚE TODOS LOS ÍTEMS PARA CONTINUAR'}
        </button>
      </div>

    </div>
  );
}