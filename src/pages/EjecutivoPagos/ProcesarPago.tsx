import { useState } from 'react';

// Simulamos los datos con la complejidad requerida
const solicitudMock = {
  id: 'SOL-999',
  cliente: 'María González',
  banco: 'Banco Santander',
  cuenta: '123456789 - Cuenta Corriente',
  rut: '19.123.456-7',
  motivoGeneral: 'Garantía',
  costoEnvioOriginal: 15000,
  items: [
    {
      id: 'ITEM-1',
      nombre: 'Laptop Pro 15"',
      precio: 1200000,
      estadoLogico: 'APROBADO_FISICAMENTE',
      estadoTexto: 'Aprobado Físicamente - Listo para Pago',
      pagable: true
    },
    {
      id: 'ITEM-2',
      nombre: 'Mouse Inalámbrico',
      precio: 45000,
      estadoLogico: 'EN_CUARENTENA',
      estadoTexto: 'Retenido en Cuarentena (Esperando revisión)',
      pagable: false
    }
  ]
};

export default function ProcesarPago({ solicitudId }: { solicitudId?: string }) {
  const solicitud = { ...solicitudMock, id: solicitudId ?? solicitudMock.id };
  // Estado para guardar qué ítems seleccionó el ejecutivo para pagar AHORA
  const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
  
  // Estado para el número de comprobante bancario (Vital para la auditoría)
  const [comprobanteBanco, setComprobanteBanco] = useState('');

  // Lógica para marcar/desmarcar ítems
  const toggleSeleccion = (id: string) => {
    setItemsSeleccionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // --- CÁLCULOS DEL SISTEMA AUTOMÁTICO ---
  const subtotalItems = solicitud.items
    .filter(i => itemsSeleccionados.includes(i.id))
    .reduce((acc, item) => acc + item.precio, 0);

  // REGLA D4: ¿Aplica reembolso de envío?
  // 1. ¿Motivo es Garantía?
  const esGarantia = solicitud.motivoGeneral === 'Garantía';
  // 2. ¿Está pagando el 100% de la orden en este momento? (Simplificado para el ejemplo)
  const esPagoTotal = itemsSeleccionados.length === solicitud.items.length;
  
  const aplicaReembolsoEnvio = esGarantia && esPagoTotal;
  const montoEnvio = aplicaReembolsoEnvio ? solicitud.costoEnvioOriginal : 0;
  
  const totalAPagar = subtotalItems + montoEnvio;

  // El botón final solo se habilita si hay algo seleccionado Y se ingresó el comprobante
  const listoParaPagar = itemsSeleccionados.length > 0 && comprobanteBanco.trim() !== '';

  const ejecutarPago = () => {
    const payload = {
      solicitudId: solicitudMock.id,
      itemsPagados: itemsSeleccionados,
      numeroTransferencia: comprobanteBanco,
      montoTotalTransferido: totalAPagar
    };
    console.log("Enviando pago al backend:", JSON.stringify(payload, null, 2));
    alert("¡Pago registrado exitosamente en el sistema!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Módulo de Pagos y Reembolsos</h1>

      <div className="grid grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Detalle de Ítems (Ocupa 2 espacios) */}
        <div className="col-span-2 space-y-4">
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Ítems de la Solicitud: {solicitudMock.id}</h2>
            
            <div className="space-y-3">
              {solicitudMock.items.map(item => (
                <label 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    !item.pagable ? 'bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed' : 
                    itemsSeleccionados.includes(item.id) ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300 hover:border-blue-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:bg-gray-300"
                      disabled={!item.pagable}
                      checked={itemsSeleccionados.includes(item.id)}
                      onChange={() => toggleSeleccion(item.id)}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                      {/* Etiqueta de estado dinámica */}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.pagable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.estadoTexto}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-700">${item.precio.toLocaleString('es-CL')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Resumen Financiero y Acción */}
        <div className="col-span-1 space-y-4">
          
          {/* Tarjeta de Datos Bancarios del Cliente */}
          <div className="bg-blue-900 text-white p-5 rounded-lg shadow-sm">
            <h3 className="text-sm uppercase text-blue-200 font-bold mb-3 tracking-wider">Datos de Transferencia</h3>
            <p className="font-semibold text-lg">{solicitudMock.cliente}</p>
            <p className="text-sm text-blue-100 mt-1">RUT: {solicitudMock.rut}</p>
            <div className="mt-4 p-3 bg-blue-800 rounded">
              <p className="text-xs text-blue-200">Banco Destino</p>
              <p className="font-medium">{solicitudMock.banco}</p>
              <p className="text-xs text-blue-200 mt-2">N° Cuenta</p>
              <p className="font-medium">{solicitudMock.cuenta}</p>
            </div>
          </div>

          {/* Tarjeta de Liquidación (Cálculos automáticos) */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Liquidación</h3>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal Ítems ({itemsSeleccionados.length})</span>
                <span>${subtotalItems.toLocaleString('es-CL')}</span>
              </div>
              
              {/* LÓGICA DE REGLA D4 VISUAL */}
              <div className="flex justify-between items-center">
                <span>Costo de Envío Original</span>
                {aplicaReembolsoEnvio ? (
                  <span className="text-green-600 font-medium">+ ${solicitud.costoEnvioOriginal.toLocaleString('es-CL')}</span>
                ) : (
                  <div className="text-right">
                    <span className="line-through text-gray-400 mr-2">${solicitud.costoEnvioOriginal.toLocaleString('es-CL')}</span>
                    <span className="text-red-500 text-xs font-bold block">(No aplica: {esGarantia ? 'Devolución parcial' : 'Retracto'})</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 mb-6">
              <span className="font-bold text-gray-800 text-lg">Total a Transferir</span>
              <span className="font-bold text-blue-600 text-2xl">${totalAPagar.toLocaleString('es-CL')}</span>
            </div>

            {/* FORMULARIO DE RESPALDO BANCARIO */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                N° Transacción Bancaria *
              </label>
              <input 
                type="text" 
                placeholder="Ej: TR-8849201"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={comprobanteBanco}
                onChange={(e) => setComprobanteBanco(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Realice la transferencia en su portal bancario e ingrese el número de operación aquí.</p>
            </div>

            <button 
              disabled={!listoParaPagar}
              onClick={ejecutarPago}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                listoParaPagar 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              REGISTRAR PAGO
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}