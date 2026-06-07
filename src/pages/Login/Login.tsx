import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">

        <div className="max-w-xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Logística de Devoluciones
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Selecciona un rol
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/cliente')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Cliente
            </button>

            <button
              onClick={() => navigate('/servicio-cliente')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Servicio al Cliente
            </button>

            <button
              onClick={() => navigate('/inspector-calidad')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Inspector de Calidad
            </button>

            <button
              onClick={() => navigate('/ejecutivo-pagos')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Ejecutivo de Pagos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;