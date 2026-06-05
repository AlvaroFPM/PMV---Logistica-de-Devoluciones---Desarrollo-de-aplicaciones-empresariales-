// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrearSolicitud from './pages/Cliente/CrearSolicitud';
import MisDevoluciones from './pages/Cliente/MisDevoluciones';
import DetalleSolicitud from './pages/Cliente/DetalleSolicitud';

export default function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Barra de navegación global simulada */}
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="font-bold text-xl text-blue-600 tracking-tight">
              Logística<span className="text-gray-800">UCT</span>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Portal del Cliente
            </div>
          </div>
        </nav>
        
        <main>
          <Routes>
            {/* Redirección por defecto para las pruebas */}
            <Route path="/" element={<Navigate to="/cliente/mis-devoluciones" replace />} />
            
            {/* Rutas del módulo Cliente */}
            <Route path="/cliente/crear-solicitud" element={<CrearSolicitud />} />
            <Route path="/cliente/mis-devoluciones" element={<MisDevoluciones />} />
            <Route path="/cliente/devoluciones/:idSolicitud" element={<DetalleSolicitud />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}