import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';


export default function Dashboard() {
  const navigate = useNavigate();
  
  // Estados para manejar los datos
  const [closets, setClosets] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para el modal de nuevo armario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClosetName, setNewClosetName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [closetsRes, outfitsRes] = await Promise.all([
          apiClient.get('/closets/'),
          apiClient.get('/outfits/')
        ]);
        setClosets(closetsRes.data);
        setOutfits(outfitsRes.data);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCloset = async () => {
    if (!newClosetName.trim()) return;
    try {
      const response = await apiClient.post('/closets/', { name: newClosetName });
      setClosets([...closets, response.data]);
      setIsModalOpen(false);
      setNewClosetName('');
    } catch (error) {
      console.error("Error al crear armario:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      

      <div className="p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          
          {/* --- CABECERA PRINCIPAL --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Tu Espacio</h1>
              <p className="text-gray-500 mt-2">Gestiona tu ropa y descubre nuevas combinaciones.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/outfits/new')}
                className="bg-white text-black border border-gray-200 px-6 py-3 rounded-xl font-bold hover:border-black hover:shadow-md transition-all flex items-center gap-2"
              >
                <span>✨</span> Crear Outfit
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                + Nuevo Armario
              </button>
            </div>
          </div>

          {/* --- SECCIÓN 1: MIS OUTFITS --- */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tus Looks Guardados</h2>
              <span className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                {outfits.length} Outfits
              </span>
            </div>

            {outfits.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-4">👗👖</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aún no tienes conjuntos</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">Usa el lienzo de creación para combinar tus prendas y guardar tus estilos favoritos.</p>
                <button onClick={() => navigate('/outfits/new')} className="text-black font-bold underline hover:text-gray-600">
                  Crear mi primer look
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {outfits.map(outfit => (
                  <div 
                    key={outfit.id} 
                    onClick={() => navigate(`/outfits/${outfit.id}`)} 
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-900 truncate pr-2 group-hover:text-black">{outfit.name}</h3>
                    </div>
                    
                    {/* Diseño de Avatares Superpuestos para la ropa */}
                    <div className="flex -space-x-4 overflow-hidden py-2 mb-4">
                      {outfit.garments.map((garment) => (
                        <div key={garment.id} className="inline-block h-16 w-16 rounded-full ring-4 ring-white relative z-0 hover:z-10 transition-transform hover:scale-110 shadow-sm bg-gray-100">
                          <img 
                            src={garment.path?.startsWith('http') ? garment.path : `http://127.0.0.1:8000${garment.path}`}
                            alt={garment.name} 
                            className="h-full w-full object-cover rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <span>{outfit.garments.length} piezas</span>
                      <span>{new Date(outfit.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- SECCIÓN 2: MIS ARMARIOS (COLECCIONES) --- */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus Armarios</h2>
            {closets.length === 0 ? (
              <div className="text-gray-500">No tienes armarios. ¡Crea uno para empezar a subir ropa!</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {closets.map(closet => (
                  <div 
                    key={closet.id} 
                    onClick={() => navigate(`/closets/${closet.id}`)}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 text-xl shadow-md">
                      📦
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">{closet.name}</h3>
                    <p className="text-gray-500 text-sm">Ver prendas &rarr;</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- MODAL PARA NUEVO ARMARIO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-2">Crear Armario</h3>
            <p className="text-gray-500 text-sm mb-6">Ponle un nombre a tu nueva colección.</p>
            <input 
              type="text" 
              placeholder="Ej: Ropa de Invierno"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-black focus:outline-none"
              value={newClosetName}
              onChange={(e) => setNewClosetName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">
                Cancelar
              </button>
              <button onClick={handleCreateCloset} className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 shadow-md">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}