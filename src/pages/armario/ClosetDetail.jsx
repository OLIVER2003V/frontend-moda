import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function ClosetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [closet, setCloset] = useState(null);
  const [garments, setGarments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para la Inteligencia Artificial
  const [isScanning, setIsScanning] = useState(false);
  
  // Estado para el Modal de Detalle
  const [selectedGarment, setSelectedGarment] = useState(null);

  useEffect(() => {
    fetchClosetData();
  }, [id]);

  const fetchClosetData = async () => {
    setIsLoading(true);
    try {
      // Pedimos el nombre del armario
      const closetRes = await apiClient.get(`/closets/${id}/`);
      setCloset(closetRes.data);

      // Pedimos toda la ropa y la filtramos para que solo muestre la de ESTE armario
      const garmentsRes = await apiClient.get('/garments/');
      const closetGarments = garmentsRes.data.filter(g => g.closet === parseInt(id));
      setGarments(closetGarments);
    } catch (error) {
      console.error("Error al cargar el armario:", error);
      toast.error("No se pudo cargar el armario.");
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  // --- LA MAGIA DE LA IA (Escanear Prenda) ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    
    // Preparamos el paquete con la foto para enviarlo a Django
    const formData = new FormData();
    formData.append('image', file);
    formData.append('closet_id', id);

    try {
      // Llamamos a la ruta que configuramos con Gemini 2.5 Flash
      const response = await apiClient.post('/garments/scan/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Agregamos la nueva prenda a la pantalla al instante
      setGarments([response.data, ...garments]);
      toast.success("¡Prenda escaneada y guardada con éxito!");
    } catch (error) {
      console.error("Error al escanear:", error);
      toast.error("Hubo un error al procesar la imagen con la IA.");
    } finally {
      setIsScanning(false);
      // Limpiamos el input para poder subir otra foto después
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- ELIMINAR UNA PRENDA ---
  const handleDeleteGarment = async (garmentId) => {
    const confirmar = window.confirm("¿Seguro que quieres borrar esta prenda de tu armario?");
    if (confirmar) {
      try {
        await apiClient.delete(`/garments/${garmentId}/`);
        setGarments(garments.filter(g => g.id !== garmentId));
        setSelectedGarment(null); // Cerramos el modal
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
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
     

      <div className="max-w-7xl mx-auto p-8 lg:p-12">
        
        {/* Cabecera del Armario */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <button onClick={() => navigate('/')} className="text-gray-500 font-bold mb-2 hover:text-black transition-colors">
              &larr; Volver a mis armarios
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              📦 {closet?.name}
            </h1>
            <p className="text-gray-500 mt-1">Tienes {garments.length} prendas aquí.</p>
          </div>

          {/* Botón Escáner IA */}
          <div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isScanning}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Analizando con IA...
                </>
              ) : (
                <>✨ Escanear Prenda</>
              )}
            </button>
          </div>
        </div>

        {/* Grilla de Prendas */}
        {garments.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
            <div className="text-6xl mb-4 opacity-50">👕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Este armario está vacío</h3>
            <p className="text-gray-500 max-w-md mx-auto">Sube una foto de tu ropa. Nuestra Inteligencia Artificial detectará automáticamente de qué prenda se trata y la guardará por ti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {garments.map(garment => (
              <div 
                key={garment.id} 
                onClick={() => setSelectedGarment(garment)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img 
                    // Siempre que veas una imagen de tu ropa, usa esta lógica:
src={garment.path?.startsWith('http') ? garment.path : `http://127.0.0.1:8000${garment.path}`} 
                    alt={garment.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black tracking-wider text-black uppercase shadow-sm">
                    {garment.category}
                  </div>
                </div>
                <div className="p-3 text-center border-t border-gray-50">
                  <p className="font-bold text-sm text-gray-900 truncate">{garment.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL DE DETALLES DE LA PRENDA (Tu solicitud) */}
      {/* ========================================== */}
      {selectedGarment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl flex flex-col md:flex-row relative">
            
            {/* Botón de Cerrar Absoluto */}
            <button 
              onClick={() => setSelectedGarment(null)}
              className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm backdrop-blur-md transition-all"
            >
              ✕
            </button>

            {/* Mitad Izquierda: Foto Grande */}
            <div className="md:w-1/2 bg-gray-100 h-64 md:h-auto relative">
              <img 
  src={selectedGarment.path?.startsWith('http') ? selectedGarment.path : `http://127.0.0.1:8000${selectedGarment.path}`} 
  alt={selectedGarment.name} 
  className="w-full h-full object-cover"
/>
            </div>

            {/* Mitad Derecha: Datos de la IA */}
            <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between bg-white">
              <div>
                <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  {selectedGarment.category}
                </span>
                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                  {selectedGarment.name}
                </h2>
                <div className="w-12 h-1 bg-black mb-6"></div>
                
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Análisis de la IA:</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic border-l-2 border-gray-200 pl-4">
                  "{selectedGarment.description || 'Sin descripción disponible.'}"
                </p>
                
                <div className="text-xs text-gray-400 font-medium">
                  Agregado el: {new Date(selectedGarment.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>

              {/* Botones de acción del Modal */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => setSelectedGarment(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => handleDeleteGarment(selectedGarment.id)}
                  className="px-4 py-3 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center"
                  title="Eliminar prenda"
                >
                  🗑️
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}