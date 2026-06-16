import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAppContext } from '../context/AppContext';

export const ProtectedRoute = ({ children, rolRequerido }: { children: ReactElement; rolRequerido: string }) => {
  const { sesion } = useAppContext();

  if (!sesion || sesion.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
};