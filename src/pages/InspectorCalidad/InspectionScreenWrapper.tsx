import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import InspectionScreen from './InspectionScreen';
import type { EstadoItem, EstadoInspeccion, SolicitudInspeccion, SolicitudMaestra } from '../../types/devolucion';

// Interfaz para soportar datos seguros sin molestar a ESLint
interface ItemSoporteBd {
  id: string;
  nombreProducto?: string;
  nombre?: string;
  motivo: string;
  n_serie: string;
  estado: EstadoItem | string;
}

const convertirEstadoAInspeccion = (estado: string): EstadoInspeccion => {
  if (estado.includes('Apto para Reacondicionamiento')) return 'Aprobado - Apto reacondicionamiento';
  if (estado.includes('Descarte Técnico')) return 'Aprobado - Descarte Técnico';
  if (estado.includes('Inconsistencia')) return 'Rechazado por Inconsistencia';
  if (estado.includes('Fraude')) return 'Rechazado por Fraude';
  if (estado === 'No Recibido') return 'No Recibido';
  return 'Pendiente';
};

const convertirEstadoDesdeInspeccion = (estado: EstadoInspeccion): EstadoItem => {
  switch (estado) {
    case 'Aprobado - Apto reacondicionamiento': return 'Aprobado — Apto para Reacondicionamiento';
    case 'Aprobado - Descarte Técnico': return 'Aprobado — Descarte Técnico';
    case 'Rechazado por Inconsistencia': return 'Rechazado por Inconsistencia Física';
    case 'Rechazado por Fraude': return 'Rechazado por Fraude';
    case 'No Recibido': return 'No Recibido';
    default: return 'Pendiente';
  }
};

export default function InspectionScreenWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudes, inspeccionarSolicitud } = useAppContext();

  const solicitud = solicitudes.find((item) => item.id === id);

  if (!solicitud) {
    return <div className="p-6 text-slate-700">Solicitud no encontrada en la Base de Datos Global.</div>;
  }

  // El inspector SOLO debe ver los ítems que sobrevivieron a la revisión documental (Pendientes)
  const itemsAInspeccionar = solicitud.items.filter(item => item.estado === 'Pendiente');

  // CORRECCIÓN: Usamos el nombre exacto que está en devolucion.ts (estado_solicitud)
  const solicitudParaInspeccion: SolicitudInspeccion = {
    id_solicitud: solicitud.id,
    estado_solicitud: solicitud.estado, // <-- ¡Este era el detalle!
    cliente: typeof solicitud.cliente === 'string' ? solicitud.cliente : solicitud.cliente?.nombre || 'Cliente',
    objetos_equivocados: solicitud.objetos_equivocados || [],
    items: itemsAInspeccionar.map((item: unknown) => {
      const i = item as ItemSoporteBd;
      return {
        id: i.id,
        nombre: i.nombreProducto || i.nombre || 'Producto',
        motivo: i.motivo,
        n_serie: i.n_serie,
        estado_inspeccion: convertirEstadoAInspeccion(i.estado)
      };
    })
  }; 

  const handleFinalizar = (solicitudActualizada: SolicitudInspeccion) => {
    // Actualizamos SOLO los estados físicos, devolviendo intactos los precios y fotos documentales
    const itemsFinales = solicitud.items.map((itemOriginal: unknown) => {
      const original = itemOriginal as ItemSoporteBd;
      const itemInspeccionado = solicitudActualizada.items.find(i => i.id === original.id);
      
      if (itemInspeccionado) {
        return {
          ...original,
          estado: convertirEstadoDesdeInspeccion(itemInspeccionado.estado_inspeccion)
        };
      }
      return original;
    });

    inspeccionarSolicitud(
      solicitudActualizada.id_solicitud,
      itemsFinales as SolicitudMaestra['items'], 
      solicitudActualizada.objetos_equivocados
    );
    
    navigate('/inspector-calidad');
  };

  if (itemsAInspeccionar.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 p-6">
        <h2 className="text-2xl font-bold text-slate-800">No hay ítems para inspeccionar</h2>
        <p className="text-slate-500 mt-2">Todos los productos de esta solicitud fueron rechazados en la revisión documental o ya se evaluaron.</p>
        <button 
          onClick={() => navigate('/inspector-calidad')} 
          className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
        >
          Volver al buscador
        </button>
      </div>
    );
  }

  return (
    <InspectionScreen 
      solicitud={solicitudParaInspeccion} 
      onFinalizar={handleFinalizar} 
      onBack={() => navigate('/inspector-calidad')} 
    />
  );
}