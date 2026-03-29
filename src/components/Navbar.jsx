import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Navbar() {
  const navigate = useNavigate();
  // Estado para guardar el nombre (por defecto dice Cargando...)
  const [username, setUsername] = useState('Cargando...');

  useEffect(() => {
    // Apenas carga el menú, pedimos los datos del usuario actual
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/auth/me/');
        // Guardamos el nombre de usuario (ej: "ventu")
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        setUsername('Mi Perfil'); // Si algo falla, ponemos el texto por defecto
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Obtenemos la primera letra para el Avatar (si ya cargó)
  const inicial = username !== 'Cargando...' && username !== 'Mi Perfil' 
    ? username.charAt(0).toUpperCase() 
    : '👤';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        
        {/* SECCIÓN IZQUIERDA: Logo */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-black tracking-tighter group flex items-center gap-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-500">
              AI
            </span>
            <span className="text-slate-800">Armario</span>
            <span className="text-indigo-500 text-3xl leading-none">.</span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Mi Armario
            </Link>
            <Link to="/outfits/new" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Crear Outfit
            </Link>
            <Link to="/advisor" className="text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all">
              <span className="animate-pulse">✨</span> IA Asesor
            </Link>
          </div>
        </div>

        {/* SECCIÓN DERECHA: Perfil Dinámico y Logout */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="hidden sm:block text-right">
              {/* AQUÍ ESTÁ LA MAGIA: Mostramos la variable {username} */}
              <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors capitalize">
                {username}
              </p>
              <p className="text-[10px] font-medium text-slate-400">Ajustes</p>
            </div>
            
            {/* Avatar con la inicial */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 p-[2px] shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-sm font-black text-indigo-600 border-2 border-white">
                {inicial}
              </div>
            </div>
          </Link>

          <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

          <button
            onClick={handleLogout}
            className="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}