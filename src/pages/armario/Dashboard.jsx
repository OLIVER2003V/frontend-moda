import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [closets, setClosets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCloset, setNewCloset] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchClosets();
  }, []);

  const fetchClosets = async () => {
    try {
      const response = await apiClient.get('/closets/');
      setClosets(response.data);
    } catch (error) {
      console.error("Error al cargar armarios:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCloset = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/closets/', newCloset);
      setIsModalOpen(false);
      setNewCloset({ name: '', description: '' });
      fetchClosets();
    } catch (error) {
      alert("Hubo un error al crear el armario."); // Idealmente cambiar a un Toast
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    // Fondo más cálido y elegante (stone-50 en lugar de gray-50)
    <div className="min-h-screen bg-stone-50 font-sans text-zinc-900 selection:bg-rose-200 selection:text-zinc-900">
      
      {/* Barra de Navegación Superior */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-tighter text-zinc-900 flex items-center gap-2">
          Mi Armario<span className="text-stone-400 font-light">.AI</span>
          <span className="text-xl">✨</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-semibold text-stone-500 hover:text-rose-600 transition-colors duration-300"
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Tus Colecciones</h2>
            <p className="text-stone-500 mt-2 text-lg">Organiza tus prendas, looks y estilos.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-zinc-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
          >
            <span>+</span> Nuevo Armario
          </button>
        </div>

        {/* Grilla de Armarios */}
        {isLoading ? (
          /* Skeleton Loading para mejor UX */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl h-48 animate-pulse border border-stone-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-stone-200 rounded-full"></div>
                <div>
                  <div className="h-5 bg-stone-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : closets.length === 0 ? (
          /* Estado Vacío Elegante */
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300 flex flex-col items-center">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">👗</span>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Tu armario está vacío</h3>
            <p className="text-stone-500 mb-8 max-w-sm">Crea tu primera colección para empezar a organizar tu ropa e inspirarte con la IA.</p>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="text-zinc-900 font-bold border-b-2 border-zinc-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
            >
              Crear mi primer armario
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {closets.map((closet) => (
              <div 
                key={closet.id} 
                onClick={() => navigate(`/closets/${closet.id}`)}
                className="group relative bg-white p-7 rounded-3xl shadow-sm border border-stone-100 hover:shadow-2xl hover:border-stone-200 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Elemento decorativo visual */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-stone-50 to-transparent rounded-tr-3xl rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10 w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300 text-zinc-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight line-clamp-1">{closet.name}</h3>
                  <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{closet.description || 'Sin descripción'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Ventana Modal para Crear Armario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-extrabold text-zinc-900">Nuevo Armario</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-zinc-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <p className="text-stone-500 text-sm mb-8">Define una nueva colección para tu estilo.</p>
            
            <form onSubmit={handleCreateCloset}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Nombre de la colección</label>
                  <input 
                    type="text" required placeholder="Ej. Outfits de Invierno ❄️" autoFocus
                    className="w-full px-5 py-4 rounded-2xl border border-stone-200 bg-stone-50 text-zinc-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    value={newCloset.name}
                    onChange={(e) => setNewCloset({...newCloset, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Descripción <span className="text-stone-400 font-normal">(Opcional)</span></label>
                  <textarea 
                    placeholder="Abrigos, bufandas y tonos tierra..." rows="3"
                    className="w-full px-5 py-4 rounded-2xl border border-stone-200 bg-stone-50 text-zinc-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
                    value={newCloset.description}
                    onChange={(e) => setNewCloset({...newCloset, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex gap-4 mt-10">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="w-1/3 px-4 py-4 rounded-2xl text-zinc-700 font-bold hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-2/3 px-4 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-transform active:scale-95 shadow-lg"
                >
                  Crear Armario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}