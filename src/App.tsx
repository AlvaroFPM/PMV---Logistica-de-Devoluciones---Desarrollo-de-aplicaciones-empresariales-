import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import CrearSolicitud from './pages/Cliente/CrearSolicitud';
import DetalleSolicitud from './pages/Cliente/DetalleSolicitud';
import MisDevoluciones from './pages/Cliente/MisDevoluciones';
import DashboardSolicitudes from './pages/ServicioCliente/DashboardSolicitudes';
import EvaluarSolicitud from './pages/ServicioCliente/EvaluarSolicitud';
import SearchScreen from './pages/InspectorCalidad/SearchScreen';
import InspectionScreen from './pages/InspectorCalidad/InspectionScreen';
import { initialDatabase, type Solicitud } from './pages/InspectorCalidad/mockData';
import BandejaPagos from './pages/EjecutivoPagos/BandejaPagos';
import ProcesarPago from './pages/EjecutivoPagos/ProcesarPago';

function VistaConBotonInicio({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigate = useNavigate();

	if (location.pathname === '/') {
		return children;
	}

	return (
		<div className="relative">
			<button
				onClick={() => navigate('/')}
				className="fixed bottom-4 left-4 z-50 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg ring-1 ring-gray-200 hover:bg-gray-50 hover:text-blue-600"
			>
				← Volver al selector de rol
			</button>
			{children}
		</div>
	);
}

function ServicioClientePage() {
	const [solicitudActiva, setSolicitudActiva] = useState<string | null>(null);

	if (solicitudActiva) {
		return (
			<EvaluarSolicitud
				solicitudId={solicitudActiva}
				onBack={() => setSolicitudActiva(null)}
			/>
		);
	}

	return <DashboardSolicitudes onEvaluar={(id) => setSolicitudActiva(id ?? null)} />;
}

function InspectorCalidadPage() {
	const [baseDatos, setBaseDatos] = useState<Record<string, Solicitud>>(initialDatabase);
	const [solicitudActual, setSolicitudActual] = useState<string | null>(null);
	const [toast, setToast] = useState<string | null>(null);

	const mostrarToast = (mensaje: string) => {
		setToast(mensaje);
		window.setTimeout(() => setToast(null), 2500);
	};

	const handleSearch = (codigo: string) => {
		const solicitud = baseDatos[codigo];

		if (!solicitud) {
			return { found: false, error: 'No se encontró una solicitud con ese código.' };
		}

		setSolicitudActual(codigo);
		return { found: true };
	};

	const handleFinalizar = (updated: Solicitud) => {
		setBaseDatos((prev) => ({ ...prev, [updated.id_solicitud]: updated }));
		setSolicitudActual(null);
		mostrarToast('Inspección finalizada correctamente.');
	};

	if (solicitudActual) {
		return (
			<div>
				{toast && (
					<div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-lg">
						{toast}
					</div>
				)}
				<InspectionScreen
					solicitud={baseDatos[solicitudActual]}
					onFinalizar={handleFinalizar}
					onBack={() => setSolicitudActual(null)}
				/>
			</div>
		);
	}

	return <SearchScreen onSearch={handleSearch} showToast={mostrarToast} />;
}

function EjecutivoPagosPage() {
	const [solicitudActiva, setSolicitudActiva] = useState<string | null>(null);

	if (solicitudActiva) {
		return (
			<ProcesarPago
				solicitudId={solicitudActiva}
				onBack={() => setSolicitudActiva(null)}
			/>
		);
	}

	return <BandejaPagos onProcesar={(id) => setSolicitudActiva(id)} />;
}

function App() {
	const routes = useMemo(
		() => (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/cliente" element={<Navigate to="/cliente/mis-devoluciones" replace />} />
					<Route path="/cliente/mis-devoluciones" element={<VistaConBotonInicio><MisDevoluciones /></VistaConBotonInicio>} />
					<Route path="/cliente/crear-solicitud" element={<VistaConBotonInicio><CrearSolicitud /></VistaConBotonInicio>} />
					<Route path="/cliente/devoluciones/:idSolicitud" element={<VistaConBotonInicio><DetalleSolicitud /></VistaConBotonInicio>} />
					<Route path="/servicio-cliente" element={<VistaConBotonInicio><ServicioClientePage /></VistaConBotonInicio>} />
					<Route path="/inspector-calidad" element={<VistaConBotonInicio><InspectorCalidadPage /></VistaConBotonInicio>} />
					<Route path="/ejecutivo-pagos" element={<VistaConBotonInicio><EjecutivoPagosPage /></VistaConBotonInicio>} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		),
		[]
	);

	return routes;
}

export default App;
