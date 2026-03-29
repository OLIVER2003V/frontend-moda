import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function OutfitDetail() {
  const { id } = useParams(); // Obtenemos el ID del outfit desde la URL
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchOutfit();
  }, [id]);

  const fetchOutfit = async () => {
    try {
      const response = await apiClient.get(`/outfits/${id}/`);
      setOutfit(response.data);
    } catch (error) {
      console.error("Error al cargar el outfit:", error);
      toast.error("No se pudo cargar la información del conjunto.");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este outfit? Las prendas seguirán en tu armario, solo se borrará esta combinación.");
    if (confirmar) {
      setIsDeleting(true);
      try {
        await apiClient.delete(`/outfits/${id}/`);
        navigate('/'); // Volvemos al dashboard tras borrar
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Hubo un problema al eliminar el outfit.");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!outfit) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <div className="max-w-5xl mx-auto p-8 lg:p-12">
        
        {/* Navegación y Acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-black font-bold flex items-center gap-2 transition-colors"
          >
            &larr; Volver al Armario
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all border border-transparent hover:border-red-200"
          >
            {isDeleting ? 'Eliminando...' : '🗑️ Eliminar Outfit'}
          </button>
        </div>

        {/* Cabecera del Outfit */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{outfit.name}</h1>
            <p className="text-gray-500 mt-2 font-medium">
              Creado el {new Date(outfit.created_at).toLocaleDateString()} • {outfit.garments.length} piezas
            </p>
          </div>
          <div className="hidden sm:flex text-6xl">
            ✨
          </div>
        </div>

        {/* Grilla de Prendas (Estilo Editorial) */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Prendas en este look</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {outfit.garments.map(garment => (
            <div key={garment.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                <img 
                  src={garment.path?.startsWith('http') ? garment.path : `http://127.0.0.1:8000${garment.path}`}
                  alt={garment.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-black tracking-wider text-black uppercase shadow-sm">
                  {garment.category}
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-900 truncate">{garment.name}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}