import type { ItemFormState } from '../types/devolucion';

interface TarjetaProductoDevolucionProps {
  idProducto: string;
  nombreProducto: string;
  imagenUrl?: string;
  bloqueadoPorConcurrencia: boolean;
  estadoFormulario: ItemFormState;
  onToggleSeleccion: (id: string) => void;
  onActualizarCampo: (
    id: string,
    campo: 'motivo' | 'comentarios' | 'evidencia',
    valor: string
  ) => void;
}

export function TarjetaProductoDevolucion({
  idProducto,
  nombreProducto,
  imagenUrl,
  bloqueadoPorConcurrencia,
  estadoFormulario,
  onToggleSeleccion,
  onActualizarCampo
}: TarjetaProductoDevolucionProps) {
  
  // Estilos dinámicos basados en el estado
  const containerClasses = bloqueadoPorConcurrencia
    ? 'border-gray-200 bg-gray-50 opacity-75'
    : estadoFormulario.seleccionado
    ? 'border-blue-500 bg-blue-50/30 shadow-sm'
    : 'border-gray-300 bg-white hover:border-blue-300';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const lector = new FileReader();

      lector.onload = () => {
        onActualizarCampo(idProducto, 'evidencia', String(lector.result ?? file.name));
      };

      lector.readAsDataURL(file);
    }
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${containerClasses}`}>
      {/* CABECERA: Checkbox y Título */}
      <div className="flex items-start gap-4">
        <div className="flex items-center h-6 mt-1">
          <input
            type="checkbox"
            id={`checkbox-${idProducto}`}
            disabled={bloqueadoPorConcurrencia}
            checked={estadoFormulario.seleccionado}
            onChange={() => onToggleSeleccion(idProducto)}
            className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
          />
        </div>
        
        {/* Espacio para imagen placeholder (Opcional) */}
        {imagenUrl && (
          <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
             <img src={imagenUrl} alt={nombreProducto} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1">
          <label 
            htmlFor={`checkbox-${idProducto}`} 
            className={`font-medium text-lg ${bloqueadoPorConcurrencia ? 'text-gray-500' : 'text-gray-900 cursor-pointer'}`}
          >
            {nombreProducto}
          </label>
          <p className="text-sm text-gray-500 font-mono mt-0.5">ID: {idProducto}</p>
          
          {bloqueadoPorConcurrencia && (
            <span className="inline-flex items-center mt-2 px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
              Solicitud en curso
            </span>
          )}
        </div>
      </div>

      {/* CUERPO: Formulario que se expande si está seleccionado */}
      {!bloqueadoPorConcurrencia && estadoFormulario.seleccionado && (
        <div className="mt-4 pt-4 border-t border-gray-200/60 pl-9 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Campo: Motivo */}
          <div>
            <label htmlFor={`motivo-${idProducto}`} className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de la devolución <span className="text-red-500">*</span>
            </label>
            <select
              id={`motivo-${idProducto}`}
              value={estadoFormulario.motivo}
              onChange={(e) => onActualizarCampo(idProducto, 'motivo', e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              required
            >
              <option value="" disabled>Seleccione un motivo...</option>
              <option value="Garantía">Falla de fábrica / Garantía</option>
              <option value="Retracto">Retracto / Ya no lo quiero</option>
              <option value="Error de envío">Producto equivocado</option>
            </select>
          </div>

          {/* Campo: Evidencia Fotográfica */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidencia fotográfica <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Subir archivo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="sr-only" 
                  onChange={handleFileUpload}
                />
              </label>
              {estadoFormulario.evidencia ? (
                <span className="text-sm text-green-600 font-medium break-all">
                  ✓ {estadoFormulario.evidencia}
                </span>
              ) : (
                <span className="text-sm text-gray-500">Ningún archivo seleccionado</span>
              )}
            </div>
          </div>

          {/* Campo: Comentarios */}
          <div>
            <label htmlFor={`comentarios-${idProducto}`} className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del problema
            </label>
            <textarea
              id={`comentarios-${idProducto}`}
              rows={2}
              value={estadoFormulario.comentarios}
              onChange={(e) => onActualizarCampo(idProducto, 'comentarios', e.target.value)}
              placeholder="Describa la situación con el producto..."
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>
      )}
    </div>
  );
}