import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import InspectionScreen from './InspectionScreen';
import type { EstadoItem, EstadoInspeccion, ItemInspeccion, SolicitudInspeccion, SolicitudMaestra } from '../../types/devolucion';

const convertirEstadoAInspeccion = (estado: EstadoItem): EstadoInspeccion => {
  const mapa: Record<EstadoItem, EstadoInspeccion> = {
    Pendiente: 'Pendiente',
    'Aprobado — Apto para Reacondicionamiento': 'Aprobado - Apto reacondicionamiento',
    'Aprobado — Descarte Técnico': 'Aprobado - Descarte Técnico',
    'Rechazado por Inconsistencia Física': 'Rechazado por Inconsistencia',
    'Rechazado por Fraude': 'Rechazado por Fraude',
    'No Recibido': 'No Recibido',
    'Objeto Equivocado Retenido': 'No Recibido'
  };

  return mapa[estado];
};

const convertirEstadoDesdeInspeccion = (estado: EstadoInspeccion): EstadoItem => {
  switch (estado) {
    case 'Aprobado - Apto reacondicionamiento':
      return 'Aprobado — Apto para Reacondicionamiento';
    case 'Aprobado - Descarte Técnico':
      return 'Aprobado — Descarte Técnico';
    case 'Rechazado por Inconsistencia':
      return 'Rechazado por Inconsistencia Física';
    case 'Rechazado por Fraude':
      return 'Rechazado por Fraude';
    case 'No Recibido':
      return 'No Recibido';
    default:
      return 'Pendiente';
  }
};

const mapearSolicitudAInspeccion = (solicitud: SolicitudMaestra): SolicitudInspeccion => ({
  id_solicitud: solicitud.id,
  estado_solicitud: solicitud.estado,
  cliente: solicitud.cliente.nombre,
  objetos_equivocados: solicitud.objetos_equivocados,
  items: solicitud.items.map((item) => ({
    id: item.id,
    nombre: item.nombreProducto,
    motivo: item.motivo,
    n_serie: item.n_serie,
    estado_inspeccion: convertirEstadoAInspeccion(item.estado)
  }))
});

const mapearItemsAmaestro = (items: ItemInspeccion[]): SolicitudMaestra['items'] =>
  items.map((item) => ({
    id: item.id,
    nombreProducto: item.nombre,
    precio: 0,
    motivo: item.motivo,
    descripcion: '',
    evidencia: '',
    estado: convertirEstadoDesdeInspeccion(item.estado_inspeccion),
    n_serie: item.n_serie
  }));

export default function InspectionScreenWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { solicitudes, inspeccionarSolicitud } = useAppContext();

  const solicitud = solicitudes.find((item) => item.id === id);

  if (!solicitud) {
    return <div className="p-6 text-slate-700">Solicitud no encontrada en la Base de Datos Global.</div>;
  }

  const handleFinalizar = (solicitudActualizada: SolicitudInspeccion) => {
    inspeccionarSolicitud(
      solicitudActualizada.id_solicitud,
      mapearItemsAmaestro(solicitudActualizada.items),
      solicitudActualizada.objetos_equivocados
    );
    alert('Inspección finalizada. Los datos se han guardado en el sistema.');
    navigate('/inspector-calidad');
  };

  return (
    <InspectionScreen
      solicitud={mapearSolicitudAInspeccion(solicitud)}
      onFinalizar={handleFinalizar}
      onBack={() => navigate('/inspector-calidad')}
    />
  );
}