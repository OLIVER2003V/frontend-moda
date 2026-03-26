import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para mejorar la experiencia de usuario (UX)

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/auth/login/', credentials);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      navigate('/'); 
    } catch (err) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-white">
      {/* Sección Izquierda: Imagen Editorial (Se oculta en celulares) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        {/* Puedes cambiar esta URL por alguna buena fotografía que hayas tomado tú mismo para darle un toque único */}
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Armario de moda" 
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white max-w-lg z-10">
          <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">
            Tu estilo,<br/>digitalizado.
          </h1>
          <p className="text-lg text-gray-200 font-light">
            Organiza tu armario, crea outfits increíbles y descubre tu mejor versión con inteligencia artificial.
          </p>
        </div>
      </div>

      {/* Sección Derecha: Formulario Minimalista */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24">
        <div className="w-full max-w-md space-y-8">
          
          {/* Cabecera */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-500 text-base">
              Ingresa tus credenciales para acceder a tu armario.
            </p>
          </div>

          {/* Formulario */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                  Correo Electrónico
                </label>
                <input 
                  id="email"
                  name="email" 
                  type="email" 
                  required 
                  placeholder="ejemplo@correo.com" 
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  onChange={handleChange} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                  Contraseña
                </label>
                <input 
                  id="password"
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Recordarme
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-black hover:text-gray-600 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Autenticando...' : 'Ingresar al Armario'}
            </button>
          </form>

          {/* Footer del Formulario */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-bold text-black hover:text-gray-800 hover:underline transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}