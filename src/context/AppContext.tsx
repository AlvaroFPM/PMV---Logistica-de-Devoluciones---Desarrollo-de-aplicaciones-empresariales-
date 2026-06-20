import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { SolicitudMaestra, UsuarioCuenta, UsuarioSession } from '../types/devolucion';
import { solicitudesIniciales } from '../store/seedData';
import { evaluarPorServicioCliente, finalizarInspeccionFisica, procesarPago } from '../store/transiciones';

interface AppContextProps {
  sesion: UsuarioSession | null;
  solicitudes: SolicitudMaestra[];
  cuentas: UsuarioCuenta[];
  login: (email: string, password: string) => boolean;
  registrarCuenta: (cuenta: UsuarioCuenta) => boolean;
  logout: () => void;
  crearSolicitud: (nueva: SolicitudMaestra) => void;
  cancelarSolicitud: (id: string) => void;
  actualizarDatosBancarios: (id: string, rut: string, banco: string, cuenta: string) => void;
  enviarAInspeccionFisica: (id: string) => void;
  coordinarRecuperacion: (idSolicitud: string, idItemOObjeto: string) => void;
  evaluarSolicitud: (id: string, decisiones: Record<string, string>) => void;
  inspeccionarSolicitud: (id: string, items: SolicitudMaestra['items'], objetos: SolicitudMaestra['objetos_equivocados']) => void;
  pagarSolicitud: (id: string) => void;
  simularVencimiento: (id: string, tipo: 'envio' | 'bancario') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

function cargarSesionInicial(): UsuarioSession | null {
  const storedSesion = sessionStorage.getItem('pmv_sesion');
  return storedSesion ? JSON.parse(storedSesion) : null;
}

function cargarCuentasIniciales(): UsuarioCuenta[] {
  const storedCuentas = localStorage.getItem('pmv_cuentas');
  return storedCuentas ? JSON.parse(storedCuentas) as UsuarioCuenta[] : [];
}

function cargarSolicitudesIniciales(): SolicitudMaestra[] {
  const storedData = localStorage.getItem('pmv_solicitudes');
  if (!storedData) {
    localStorage.setItem('pmv_solicitudes', JSON.stringify(solicitudesIniciales));
    return solicitudesIniciales;
  }

  return JSON.parse(storedData) as SolicitudMaestra[];
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sesion, setSesion] = useState<UsuarioSession | null>(() => cargarSesionInicial());
  const [solicitudes, setSolicitudes] = useState<SolicitudMaestra[]>(() => cargarSolicitudesIniciales());
  const [cuentas, setCuentas] = useState<UsuarioCuenta[]>(() => cargarCuentasIniciales());

  useEffect(() => {
    sessionStorage.setItem('pmv_sesion', JSON.stringify(sesion));
  }, [sesion]);

  useEffect(() => {
    localStorage.setItem('pmv_solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem('pmv_cuentas', JSON.stringify(cuentas));
  }, [cuentas]);

  const login = (email: string, password: string) => {
    const cuenta = cuentas.find((registro) => registro.email.toLowerCase() === email.toLowerCase() && registro.password === password);

    if (cuenta) {
      const user: UsuarioSession = { usuario: cuenta.email, rol: cuenta.rol, nombre: cuenta.nombre };
      setSesion(user);
      sessionStorage.setItem('pmv_sesion', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const registrarCuenta = (cuenta: UsuarioCuenta) => {
    const existe = cuentas.some((registro) => registro.email.toLowerCase() === cuenta.email.toLowerCase());

    if (existe) {
      return false;
    }

    setCuentas((prev) => [...prev, cuenta]);
    return true;
  };

  const logout = () => {
    setSesion(null);
    sessionStorage.removeItem('pmv_sesion');
  };

  const crearSolicitud = (nueva: SolicitudMaestra) => {
    setSolicitudes((prev) => [...prev, nueva]);
  };

  const cancelarSolicitud = (id: string) => {
    setSolicitudes((prev) => prev.map((solicitud) => (solicitud.id === id ? { ...solicitud, estado: 'Cancelada por el Cliente' } : solicitud)));
  };

  const actualizarDatosBancarios = (id: string, rut: string, banco: string, cuenta: string) => {
    setSolicitudes((prev) => prev.map((solicitud) => {
      if (solicitud.id !== id) return solicitud;

      return {
        ...solicitud,
        cliente: {
          ...solicitud.cliente,
          rut: rut || solicitud.cliente.rut,
          banco,
          cuenta
        }
      };
    }));
  };

  const enviarAInspeccionFisica = (id: string) => {
    setSolicitudes((prev) => prev.map((solicitud) => (
      solicitud.id === id && (solicitud.estado === 'En Tránsito' || solicitud.estado === 'Aprobada para Envío')
        ? { ...solicitud, estado: 'En Inspección Física' }
        : solicitud
    )));
  };

  const coordinarRecuperacion = (idSolicitud: string, idItemOObjeto: string) => {
    setSolicitudes((prev) => prev.map((solicitud) => {
      if (solicitud.id !== idSolicitud) return solicitud;
      const recuperaciones = solicitud.recuperacionesCoordinadas || [];
      if (recuperaciones.includes(idItemOObjeto)) return solicitud;
      return { ...solicitud, recuperacionesCoordinadas: [...recuperaciones, idItemOObjeto] };
    }));
  };

  const evaluarSolicitud = (id: string, decisiones: Record<string, string>) => {
    setSolicitudes((prev) => prev.map((solicitud) => {
      if (solicitud.id !== id) return solicitud;

      return evaluarPorServicioCliente(solicitud, decisiones);
    }));
  };

  const simularVencimiento = (id: string, tipo: 'envio' | 'bancario') => {
    setSolicitudes((prev) => prev.map((solicitud) => {
      if (solicitud.id !== id) return solicitud;
      const estadoNuevo = tipo === 'envio' ? 'Cancelada — Plazo de Envío Expirado' : 'Cancelada — Plazo Bancario Expirado';
      return { ...solicitud, estado: estadoNuevo };
    }));
  };

  const inspeccionarSolicitud = (id: string, items: SolicitudMaestra['items'], objetos: SolicitudMaestra['objetos_equivocados']) => {
    setSolicitudes((prev) => prev.map((solicitud) => (solicitud.id === id ? finalizarInspeccionFisica(solicitud, items, objetos) : solicitud)));
  };

  const pagarSolicitud = (id: string) => {
    setSolicitudes((prev) => prev.map((solicitud) => (solicitud.id === id ? procesarPago(solicitud) : solicitud)));
  };

  return (
    <AppContext.Provider value={{ sesion, solicitudes, cuentas, login, registrarCuenta, logout, crearSolicitud, cancelarSolicitud, actualizarDatosBancarios, enviarAInspeccionFisica, coordinarRecuperacion, evaluarSolicitud, inspeccionarSolicitud, pagarSolicitud, simularVencimiento }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext debe usarse dentro de un AppProvider');
  }

  return context;
};