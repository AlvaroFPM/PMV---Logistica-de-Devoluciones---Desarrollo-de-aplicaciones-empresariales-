import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import CrearSolicitud from './pages/Cliente/CrearSolicitud';
import DetalleSolicitud from './pages/Cliente/DetalleSolicitud';
import MisDevoluciones from './pages/Cliente/MisDevoluciones';
import DashboardSolicitudes from './pages/ServicioCliente/DashboardSolicitudes';
import EvaluarSolicitud from './pages/ServicioCliente/EvaluarSolicitud';
import ResumenSolicitud from './pages/ServicioCliente/ResumenSolicitud';
import SearchScreen from './pages/InspectorCalidad/SearchScreen';
import InspectionScreenWrapper from './pages/InspectorCalidad/InspectionScreenWrapper';
import BandejaPagos from './pages/EjecutivoPagos/BandejaPagos';
import ProcesarPago from './pages/EjecutivoPagos/ProcesarPago';

function AuthedLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout, sesion } = useAppContext();

	if (location.pathname === '/') {
		return <Outlet />;
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-500">Logística PMV</p>
						<p className="text-sm font-semibold text-slate-800">Rol activo: {sesion?.rol ?? 'sin sesión'}</p>
					</div>
					<button
						onClick={() => {
							logout();
							navigate('/');
						}}
						className="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700"
					>
						Cerrar sesión
					</button>
				</div>
			</header>
			<Outlet />
		</div>
	);
}

function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route element={<AuthedLayout />}>
						<Route path="cliente" element={<ProtectedRoute rolRequerido="cliente"><Navigate to="/cliente/mis-devoluciones" replace /></ProtectedRoute>} />
						<Route path="cliente/mis-devoluciones" element={<ProtectedRoute rolRequerido="cliente"><MisDevoluciones /></ProtectedRoute>} />
						<Route path="cliente/crear-solicitud" element={<ProtectedRoute rolRequerido="cliente"><CrearSolicitud /></ProtectedRoute>} />
						<Route path="cliente/devoluciones/:idSolicitud" element={<ProtectedRoute rolRequerido="cliente"><DetalleSolicitud /></ProtectedRoute>} />
						<Route path="servicio-cliente" element={<ProtectedRoute rolRequerido="servicio_cliente"><DashboardSolicitudes /></ProtectedRoute>} />
						<Route path="servicio-cliente/:idSolicitud" element={<ProtectedRoute rolRequerido="servicio_cliente"><EvaluarSolicitud /></ProtectedRoute>} />
						<Route path="servicio-cliente/resumen/:idSolicitud" element={<ProtectedRoute rolRequerido="servicio_cliente"><ResumenSolicitud /></ProtectedRoute>} />
						<Route path="inspector-calidad" element={<ProtectedRoute rolRequerido="inspector"><SearchScreen /></ProtectedRoute>} />
						<Route path="inspector-calidad/inspeccion/:id" element={<ProtectedRoute rolRequerido="inspector"><InspectionScreenWrapper /></ProtectedRoute>} />
						<Route path="ejecutivo-pagos" element={<ProtectedRoute rolRequerido="ejecutivo_pagos"><BandejaPagos /></ProtectedRoute>} />
						<Route path="ejecutivo-pagos/:idSolicitud" element={<ProtectedRoute rolRequerido="ejecutivo_pagos"><ProcesarPago /></ProtectedRoute>} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AppProvider>
	);
}

export default App;
