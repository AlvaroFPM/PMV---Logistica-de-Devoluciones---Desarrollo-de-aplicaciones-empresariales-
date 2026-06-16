import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TarjetaProductoDevolucion } from '../../components/TarjetaProductoDevolucion';
import { useAppContext } from '../../context/AppContext';
import type { ItemFormState, SolicitudMaestra } from '../../types/devolucion';

// Datos simulados de la orden de compra
const productosOrden = [
  { id: 'PROD-001', nombre: 'Cámara Mirrorless Sony ZVE10', precio: 650000 },
  { id: 'PROD-002', nombre: 'Raqueta Wilson Clash V2 100L', precio: 180000 },
  { id: 'PROD-003', nombre: 'Teclado Digital Casio CT-S1', precio: 120000 }
];

export default function CrearSolicitud() {
  const navigate = useNavigate();
  const { crearSolicitud, solicitudes, sesion } = useAppContext();

  const productosBloqueados = productosOrden
    .filter((producto) => solicitudes.some((solicitud) => solicitud.items.some((item) => item.nombreProducto === producto.nombre && !solicitud.estado.startsWith('Cancelada'))))
    .map((producto) => producto.id);

  // Inicialización perezosa (Lazy Initialization)
  const [formItems, setFormItems] = useState<Record<string, ItemFormState>>(() => {
    return productosOrden.reduce((acumulador, producto) => {
      acumulador[producto.id] = {
        seleccionado: false,
        motivo: '',
        comentarios: '',
        evidencia: '' // Usamos string vacío en vez de null para la persistencia
      };
      return acumulador;
    }, {} as Record<string, ItemFormState>);
  });

  // Handler para conmutar el checkbox principal de cada tarjeta
  const handleToggleSeleccion = (id: string) => {
    setFormItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        seleccionado: !prev[id].seleccionado
      }
    }));
  };

  // Handler unificado para la actualización inmutable de inputs hijos
  const handleActualizarCampo = (
    id: string,
    campo: keyof ItemFormState,
    valor: string | boolean
  ) => {
    setFormItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  // Handler del envío del formulario Maestro-Detalle
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filtramos para aislar únicamente los ítems marcados por el usuario
    const itemsSeleccionados = Object.entries(formItems)
      .filter(([_, estado]) => estado.seleccionado);

    if (itemsSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto para devolver.');
      return;
    }

    // Validación estricta
    const faltanDatos = itemsSeleccionados.some(([_, estado]) => !estado.motivo || !estado.evidencia);
    if (faltanDatos) {
      alert('Por favor, selecciona el motivo y adjunta la evidencia en todos los productos marcados.');
      return;
    }

    const nuevaSolicitud: SolicitudMaestra = {
      id: `DEV-2026-${Math.floor(100 + Math.random() * 900)}`,
      idOrdenCompra: 'OC-2026-771',
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'Creada',
      cliente: {
        nombre: sesion?.nombre ?? 'Cliente Demo',
        rut: 'N/A',
        banco: 'Pendiente',
        cuenta: 'Pendiente'
      },
      costoEnvioOriginal: 15000,
      objetos_equivocados: [],
      items: itemsSeleccionados.map(([id, estado]) => ({
        id,
        nombreProducto: productosOrden.find((p) => p.id === id)?.nombre || 'Producto',
        precio: productosOrden.find((p) => p.id === id)?.precio || 0,
        motivo: estado.motivo,
        evidencia: estado.evidencia,
        estado: 'Pendiente',
        n_serie: 'N/A'
      }))
    };

    crearSolicitud(nuevaSolicitud);
    alert(`Solicitud ${nuevaSolicitud.id} creada con éxito.`);
    navigate('/cliente/mis-devoluciones');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Cabecera del Documento */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crear Solicitud de Devolución</h1>
          <p className="text-gray-500 mt-1">Orden de Compra: <span className="font-mono text-gray-700">OC-2026-771</span></p>
        </header>

        {/* Contenedor del Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Selecciona los productos a devolver
            </h2>
            
            <div className="space-y-4">
              {productosOrden.map((producto) => (
                <TarjetaProductoDevolucion
                  key={producto.id}
                  idProducto={producto.id}
                  nombreProducto={producto.nombre}
                  bloqueadoPorConcurrencia={productosBloqueados.includes(producto.id)}
                  estadoFormulario={formItems[producto.id]}
                  onToggleSeleccion={handleToggleSeleccion}
                  onActualizarCampo={handleActualizarCampo}
                />
              ))}
            </div>
          </div>

          {/* Bloque informativo de Regla de Negocio (RN5) */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong className="block mb-1">Información sobre reembolsos de envío</strong>
              Según nuestras políticas, el costo del despacho original solo será reembolsado si el motivo de tu solicitud es por <em>Garantía / Falla de fábrica</em> y decides devolver la totalidad de los productos de esta orden de compra.
            </div>
          </div>

          {/* Botonera de Acción */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/cliente/mis-devoluciones')}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}