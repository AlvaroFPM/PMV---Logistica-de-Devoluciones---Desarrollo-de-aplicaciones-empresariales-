import React, { useState } from 'react';

// === COMPONENTES INTERNOS PARA SIMULAR LAS PESTAÑAS DE CADA ROL ===

const VistaCliente = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 animate-fadeIn">
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Portal del Cliente</h3>
    <p className="text-gray-600 mb-4">Módulo destinado a la creación y consulta de solicitudes de devolución.</p>
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
      [Próximamente: Historial de pedidos y formulario de devolución]
    </div>
  </div>
);

const VistaServicioCliente = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 animate-fadeIn">
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Panel de Servicio al Cliente</h3>
    <p className="text-gray-600 mb-4">Módulo para la recepción, validación y escalamiento de solicitudes pendientes.</p>
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
      [Próximamente: Bandeja de entrada de tickets y chat de soporte]
    </div>
  </div>
);

const VistaInspectorCalidad = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 animate-fadeIn">
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Módulo de Inspección de Calidad</h3>
    <p className="text-gray-600 mb-4">Módulo para el registro de dictámenes técnicos y estado físico de productos devueltos.</p>
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
      [Próximamente: Checklists de inspección y carga de evidencias fotográficas]
    </div>
  </div>
);

const VistaEjecutivoPagos = () => (
  <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 animate-fadeIn">
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Panel del Ejecutivo de Pagos</h3>
    <p className="text-gray-600 mb-4">Módulo para la emisión de notas de crédito, reembolsos y dispersión de fondos.</p>
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
      [Próximamente: Pasarela de pagos, estados financieros y aprobaciones]
    </div>
  </div>
);


// === COMPONENTE PRINCIPAL LOGIN ===

const Login = () => {
  // Estado para controlar qué vista/rol estamos simulando
  const [rolActivo, setRolActivo] = useState(null);

  // Función para renderizar la pestaña del rol correspondiente
  const renderizarPestañaRol = () => {
    switch (rolActivo) {
      case 'cliente': return <VistaCliente />;
      case 'servicio': return <VistaServicioCliente />;
      case 'inspector': return <VistaInspectorCalidad />;
      case 'pagos': return <VistaEjecutivoPagos />;
      default: return null;
    }
  };

  const nombresRoles = {
    cliente: 'Cliente',
    servicio: 'Servicio al Cliente',
    inspector: 'Inspector de Calidad',
    pagos: 'Ejecutivo de Pagos',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        
        {rolActivo === null ? (
          /* PANTALLA INICIAL: Selector con botones azules en medio de la pantalla */
          <div className="max-w-xl w-full text-center space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Logística de Devoluciones
              </h1>
              <p className="text-gray-500 mt-3 text-lg">
                Selecciona un rol
              </p>
            </div>

            {/* Cuadrícula de Botones Azules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setRolActivo('cliente')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Cliente
              </button>

              <button
                onClick={() => setRolActivo('servicio')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Servicio al Cliente
              </button>

              <button
                onClick={() => setRolActivo('inspector')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Inspector de Calidad
              </button>

              <button
                onClick={() => setRolActivo('pagos')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Ejecutivo de Pagos
              </button>
            </div>
          </div>
        ) : (
          /* PANTALLA SECUNDARIA: Muestra la pestaña del rol elegido */
          <div className="max-w-4xl w-full space-y-4">
            {/* Barra de control para el avance */}
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                Pestaña Activa: {nombresRoles[rolActivo]}
              </span>
              <button
                onClick={() => setRolActivo(null)}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                ← Volver al Selector
              </button>
            </div>

            {/* Contenedor dinámico */}
            {renderizarPestañaRol()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;