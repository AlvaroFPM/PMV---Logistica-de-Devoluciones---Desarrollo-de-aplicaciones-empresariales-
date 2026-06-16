import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Simulamos los datos con URLs de imágenes falsas para probar el zoom
const solicitudMock = {
  id: 'SOL-8890',
  fechaCompra: '2026-03-15',
  fechaSolicitud: '2026-06-03',
  cliente: 'Juan Pérez',
  total: '$850.000',
  items: [
    {
      id: 'ITEM-1',
      nombre: 'Smartphone XYZ Pro',
      precio: '$750.000',
      motivo: 'Garantía',
      diasTranscurridos: 80,
      limiteDias: 90,
      estadoFisico: 'Pantalla con manchas, sin golpes',
      foto: '📱', 
      evidencias: [
        'https://picsum.photos/seed/telefono1/600/800',
        'https://picsum.photos/seed/telefono2/600/800'
      ]
    },
    {
      id: 'ITEM-2',
      nombre: 'Carcasa Protectora XYZ',
      precio: '$100.000',
      motivo: 'Retracto',
      diasTranscurridos: 80,
      limiteDias: 10,
      estadoFisico: 'Sellado, nunca abierto',
      foto: '🛡️',
      evidencias: [
        'https://picsum.photos/seed/carcasa/600/800'
      ]
    }
  ]
};

export default function EvaluarSolicitud() {
  const navigate = useNavigate();
  const { idSolicitud } = useParams<{ idSolicitud: string }>();
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  const [decisiones, setDecisiones] = useState<Record<string, string>>({});
  
  // NUEVO ESTADO: Controla qué imagen se está mostrando en grande (null significa que el modal está cerrado)
  const [imagenZoom, setImagenZoom] = useState<string | null>(null);
  const solicitudId = idSolicitud ?? solicitudMock.id;

  const toggleExpandir = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  const manejarDecision = (itemId: string, decision: string) => {
    setDecisiones(prev => ({ ...prev, [itemId]: decision }));
  };

  const itemsEvaluados = Object.keys(decisiones).length;
  const totalItems = solicitudMock.items.length;
  const faltan = totalItems - itemsEvaluados;
  const listoParaConfirmar = faltan === 0;

  // Paso 1: Función integrada que arma el JSON requerido por el Backend
  const enviarEvaluacion = () => {
    // Validación de seguridad para no enviar datos incompletos
    if (!listoParaConfirmar) return;

    // 1. Armamos el objeto tal como lo exige el Backend
    const payload = {
      agenteId: "AGENTE-001", // Simulado por ahora
      solicitudId,
      evaluacionItems: Object.entries(decisiones).map(([id, decision]) => ({
        itemId: id,
        // Formateamos el texto de la UI a un código de Base de Datos
        estadoDecision: decision === 'Aprobado' ? 'APROBADO' : 
                        decision === 'Rechazo Evidencia' ? 'RECHAZO_DOCUMENTAL' : 'RECHAZO_POLITICAS'
      }))
    };

    // 2. Mostramos en consola lo que enviaríamos a la API
    console.log("Enviando al servidor:", JSON.stringify(payload, null, 2));
    
    // 3. Feedback visual para el usuario
    alert("¡Evaluación enviada con éxito! Revisa la consola.");
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
          <p className="text-gray-500 mt-1">Cliente: {solicitudMock.cliente}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-md">Fecha Compra: {solicitudMock.fechaCompra}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-md">Fecha Solicitud: {solicitudMock.fechaSolicitud}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Orden</p>
          <p className="text-2xl font-bold text-blue-600">{solicitudMock.total}</p>
        </div>
      </div>

      {/* LISTA DE ÍTEMS */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between">
        <span>Ítems a Evaluar</span>
        {faltan > 0 && <span className="text-orange-500 text-sm bg-orange-100 px-2 py-1 rounded font-medium">Faltan {faltan} por evaluar</span>}
      </h2>

      <div className="space-y-4">
        {solicitudMock.items.map(item => {
          const garantiaValida = item.diasTranscurridos <= item.limiteDias;
          const estaExpandido = itemExpandido === item.id;
          
          return (
            <div key={item.id} className={`bg-white rounded-lg shadow-sm border transition-all ${decisiones[item.id] ? 'border-green-400' : 'border-gray-200'} overflow-hidden`}>
              
              {/* BOX HORIZONTAL PRINCIPAL */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl">
                    {item.foto}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                    <p className="text-sm text-gray-500">Motivo: <span className="font-medium text-gray-700">{item.motivo}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {garantiaValida ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200">
                      Garantía: Vigente ({item.diasTranscurridos}/{item.limiteDias} días)
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium border border-red-200">
                      Garantía: Expirada ({item.diasTranscurridos}/{item.limiteDias} días)
                    </span>
                  )}
                  
                  <p className="font-semibold text-gray-700 w-24 text-right">{item.precio}</p>
                  
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
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-6">
                  <div className="flex-1 grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Descripción del Cliente</p>
                      <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 h-24 overflow-y-auto">
                        {item.estadoFisico}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Evidencia Fotográfica</p>
                      <div className="flex gap-3">
                        {item.evidencias.map((urlFoto, index) => (
                          <img 
                            key={index}
                            src={urlFoto} 
                            alt={`Evidencia ${index + 1}`}
                            onClick={() => setImagenZoom(urlFoto)}
                            className="w-24 h-24 object-cover rounded border border-gray-300 hover:border-blue-400 hover:shadow-md cursor-zoom-in transition-all"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* BOTONES DE DECISIÓN */}
                  <div className="w-64 border-l border-gray-200 pl-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Decisión Documental</p>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => manejarDecision(item.id, 'Aprobado')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Aprobado' ? 'bg-green-50 border-green-500 text-green-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>✅ Aprobar Envío</button>
                      <button onClick={() => manejarDecision(item.id, 'Rechazo Evidencia')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Rechazo Evidencia' ? 'bg-red-50 border-red-500 text-red-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>❌ Rechazar (Falta Evidencia)</button>
                      <button onClick={() => manejarDecision(item.id, 'Rechazo Politicas')} className={`px-3 py-2 text-sm text-left rounded border transition-all ${decisiones[item.id] === 'Rechazo Politicas' ? 'bg-red-50 border-red-500 text-red-700 font-semibold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}>❌ Rechazar (Políticas/Garantía)</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paso 2: Botón gigante con el evento onClick añadido */}
      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={enviarEvaluacion} // <--- ¡Conectado aquí!
          disabled={!listoParaConfirmar}
          className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${listoParaConfirmar ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {listoParaConfirmar ? 'CONFIRMAR EVALUACIÓN' : 'EVALÚE TODOS LOS ÍTEMS PARA CONTINUAR'}
        </button>
      </div>

      {/* MODAL DE ZOOM DE IMAGEN (LIGHTBOX) */}
      {imagenZoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setImagenZoom(null)}
        >
          <div className="relative max-w-4xl max-h-full flex flex-col items-center">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-4xl font-bold transition-colors"
              onClick={() => setImagenZoom(null)}
            >
              &times;
            </button>
            <img 
              src={imagenZoom} 
              alt="Evidencia ampliada" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>
  );
}