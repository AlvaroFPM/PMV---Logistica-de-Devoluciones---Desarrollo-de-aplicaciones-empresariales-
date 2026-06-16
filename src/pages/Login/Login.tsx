import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'servicio_cliente' | 'inspector' | 'ejecutivo_pagos'>('cliente');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, registrarCuenta, cuentas } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(email, password)) {
      const cuenta = cuentas.find((registro) => registro.email.toLowerCase() === email.toLowerCase());
      if (cuenta?.rol === 'cliente') navigate('/cliente/mis-devoluciones');
      else if (cuenta?.rol === 'servicio_cliente') navigate('/servicio-cliente');
      else if (cuenta?.rol === 'inspector') navigate('/inspector-calidad');
      else if (cuenta?.rol === 'ejecutivo_pagos') navigate('/ejecutivo-pagos');
    } else {
      setError('Credenciales incorrectas o cuenta inexistente.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !nombre.trim()) {
      setError('Completa todos los campos para registrarte.');
      return;
    }

    const ok = registrarCuenta({ email: email.trim(), password, rol, nombre: nombre.trim() });

    if (!ok) {
      setError('Ya existe una cuenta con ese correo.');
      return;
    }

    setModoRegistro(false);
    setError('');
    setPassword('');
    setNombre('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Logística de Devoluciones
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              {modoRegistro ? 'Registro de cuenta' : 'Acceso PMV'}
            </p>
          </div>

          {!modoRegistro ? (
            <form onSubmit={handleLogin} className="space-y-4 text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-700 mb-1">Cuentas de demostración</p>
                <p>cliente@pmv.cl / Cliente#2026</p>
                <p>agente@pmv.cl / Agente#2026</p>
                <p>inspector@pmv.cl / Inspector#2026</p>
                <p>pagos@pmv.cl / Pagos#2026</p>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                Correo
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Ingresar al Sistema
              </button>

              <button
                type="button"
                onClick={() => { setModoRegistro(true); setError(''); }}
                className="w-full text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Crear cuenta nueva
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700">
                Nombre completo
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setError(''); }}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Correo
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700">
                Rol
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as typeof rol)}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="servicio_cliente">Servicio al Cliente</option>
                  <option value="inspector">Inspector de Calidad</option>
                  <option value="ejecutivo_pagos">Ejecutivo de Pagos</option>
                </select>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Registrarme
              </button>

              <button
                type="button"
                onClick={() => { setModoRegistro(false); setError(''); }}
                className="w-full text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Ya tengo cuenta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;