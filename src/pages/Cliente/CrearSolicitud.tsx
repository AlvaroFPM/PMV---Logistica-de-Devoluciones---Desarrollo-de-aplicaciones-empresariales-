import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TarjetaProductoDevolucion } from '../../components/TarjetaProductoDevolucion';
import { useAppContext } from '../../context/AppContext';
import type { ItemFormState, SolicitudMaestra } from '../../types/devolucion';


const generarIdAleatorio = () => `DEV-2026-${Math.floor(100 + Math.random() * 900)}`;
const generarFechaActual = () => new Date().toISOString().split('T')[0];
const generarSerialAleatorio = () => `SN-${Math.floor(100000 + Math.random() * 900000)}`;

const ORDENES_CLIENTE = [
  {
    id: 'OC-2026-771',
    fecha: '15/05/2026',
    productos: [
      { id: 'PROD-001', nombre: 'Cámara Mirrorless Sony ZVE10', precio: 650000 },
      { id: 'PROD-002', nombre: 'Raqueta Wilson Clash V2 100L', precio: 180000 },
      { id: 'PROD-003', nombre: 'Teclado Digital Casio CT-S1', precio: 120000 },
      { id: 'PROD-004', nombre: 'Celular Samsung S24+', precio: 500000 },
      { id: 'PROD-005', nombre: 'Audífonos Bose QuietComfort 45', precio: 200000 },
    ]
  },
  {
    id: 'OC-2026-882',
    fecha: '02/06/2026',
    productos: [
      { id: 'PROD-006', nombre: 'Smartwatch Garmin Venu 2', precio: 250000 },
      { id: 'PROD-007', nombre: 'Tablet Apple iPad Air', precio: 400000 },
      { id: 'PROD-008', nombre: 'Laptop Dell XPS 13', precio: 1200000 },
      { id: 'PROD-009', nombre: 'Monitor Gamer LG 27"', precio: 350000 },
      { id: 'PROD-010', nombre: 'Micrófono HyperX QuadCast', precio: 150000 },
    ]
  },
  {
    id: 'OC-2026-905',
    fecha: '10/06/2026',
    productos: [
      { id: 'PROD-011', nombre: 'Mouse Logitech G Pro X', precio: 90000 },
      { id: 'PROD-012', nombre: 'Consola PlayStation 5', precio: 800000 },
      { id: 'PROD-013', nombre: 'Silla Gamer Ergonómica', precio: 700000 },
      { id: 'PROD-014', nombre: 'Escritorio Eléctrico Regulable', precio: 300000 },
      { id: 'PROD-015', nombre: 'Audífonos HyperX Cloud II', precio: 100000 }
    ]
  }
];

export default function CrearSolicitud() {
  const navigate = useNavigate();
  const { crearSolicitud, solicitudes } = useAppContext();

  const [idOrdenActiva, setIdOrdenActiva] = useState(ORDENES_CLIENTE[0].id);
  const ordenActual = ORDENES_CLIENTE.find(o => o.id === idOrdenActiva)!;

  const obtenerInfoBloqueo = (nombreProducto: string) => {
    const solicitudAsociada = solicitudes.find((sol) =>
      sol.items.some((item) => item.nombreProducto === nombreProducto)
    );

    if (!solicitudAsociada) return { esBloqueado: false, texto: '' };
    const estado = solicitudAsociada.estado;

    if (estado === 'Finalizada con Éxito' || estado.startsWith('Cancelada') || estado.startsWith('Cerrada')) {
      return { esBloqueado: true, texto: 'Completada' };
    }
    return { esBloqueado: true, texto: 'Solicitud en curso' };
  };

  const [formItems, setFormItems] = useState<Record<string, ItemFormState>>(() => {
    return ORDENES_CLIENTE[0].productos.reduce((acumulador, producto) => {
      acumulador[producto.id] = {
        seleccionado: false,
        motivo: '',
        comentarios: '',
        evidencia: ''
      };
      return acumulador;
    }, {} as Record<string, ItemFormState>);
  });

  const handleCambioOrden = (nuevaOrdenId: string) => {
    setIdOrdenActiva(nuevaOrdenId);
    const nuevaOrden = ORDENES_CLIENTE.find(o => o.id === nuevaOrdenId)!;
    
    const nuevoEstado = nuevaOrden.productos.reduce((acumulador, producto) => {
      acumulador[producto.id] = {
        seleccionado: false,
        motivo: '',
        comentarios: '',
        evidencia: ''
      };
      return acumulador;
    }, {} as Record<string, ItemFormState>);
    
    setFormItems(nuevoEstado);
  };

  const handleToggleSeleccion = (id: string) => {
    setFormItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], seleccionado: !prev[id].seleccionado }
    }));
  };

  const handleActualizarCampo = (
    id: string,
    campo: 'motivo' | 'comentarios' | 'evidencia',
    valor: string
  ) => {
    setFormItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemsSeleccionados = Object.entries(formItems).filter(([, estado]) => estado.seleccionado);

    if (itemsSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto para devolver.');
      return;
    }

    const faltanDatos = itemsSeleccionados.some(([, estado]) => !estado.motivo || !estado.evidencia);
    if (faltanDatos) {
      alert('Por favor, selecciona el motivo y adjunta la evidencia en todos los productos marcados.');
      return;
    }

    const nuevaSolicitud: SolicitudMaestra = {
      id: generarIdAleatorio(),         // <--- Llamamos a la función segura
      idOrdenCompra: idOrdenActiva,
      fechaCreacion: generarFechaActual(), // <--- Llamamos a la función segura
      estado: 'Creada',
      cliente: { nombre: 'Amaro', rut: '19.123.456-7', banco: 'Banco de Chile', cuenta: '123456789' },
      costoEnvioOriginal: 15000,
      objetos_equivocados: [],
      items: itemsSeleccionados.map(([id, estado]) => ({
        id,
        nombreProducto: ordenActual.productos.find((p) => p.id === id)?.nombre || 'Producto',
        precio: ordenActual.productos.find((p) => p.id === id)?.precio || 0,
        motivo: estado.motivo,
        evidencia: estado.evidencia,
        descripcion: estado.comentarios || '', 
        estado: 'Pendiente',
        n_serie: generarSerialAleatorio() // <--- Llamamos a la función segura
      }))
    };

    crearSolicitud(nuevaSolicitud);
    alert(`Solicitud ${nuevaSolicitud.id} creada con éxito para la orden ${idOrdenActiva}.`);
    navigate('/cliente/mis-devoluciones');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crear Solicitud de Devolución</h1>
          <p className="text-gray-500 mt-1">Selecciona la orden y los productos que deseas gestionar.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label htmlFor="selector-orden" className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              1. Selecciona tu Orden de Compra
            </label>
            <select
              id="selector-orden"
              value={idOrdenActiva}
              onChange={(e) => handleCambioOrden(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors animate-none"
            >
              {ORDENES_CLIENTE.map((orden) => (
                <option key={orden.id} value={orden.id}>
                  Orden {orden.id} — Comprada el {orden.fecha} ({orden.productos.length} ítems)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-5">
              2. Selecciona los productos a devolver
            </h2>
            
            <div className="space-y-4">
              {ordenActual.productos.map((producto) => {
                const infoBloqueo = obtenerInfoBloqueo(producto.nombre);
                return (
                  <TarjetaProductoDevolucion
                    key={producto.id}
                    idProducto={producto.id}
                    nombreProducto={producto.nombre}
                    precio={producto.precio}
                    bloqueadoPorConcurrencia={infoBloqueo.esBloqueado}
                    textoBloqueo={infoBloqueo.texto}
                    estadoFormulario={formItems[producto.id] || { seleccionado: false, motivo: '', comentarios: '', evidencia: '' }}
                    onToggleSeleccion={handleToggleSeleccion}
                    onActualizarCampo={handleActualizarCampo}
                  />
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <strong className="block mb-1">Información sobre reembolsos de envío</strong>
              Según nuestras políticas, el costo del despacho original solo será reembolsado si el motivo de tu solicitud es por <em>Garantía / Falla de fábrica</em> y decides devolver la totalidad de los productos de esta orden de compra.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/cliente/mis-devoluciones')}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}