import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

export default function ClosetDetail() {
  const { id } = useParams(); // Obtenemos el ID del armario de la URL
  const navigate = useNavigate();
  
  const [closet, setCloset] = useState(null);
  const [garments, setGarments] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchClosetData();
  }, [id]);

  const fetchClosetData = async () => {
    try {
      // 1. Traemos los detalles de este armario
      const closetRes = await apiClient.get(`/closets/${id}/`);
      setCloset(closetRes.data);

      // 2. Traemos TODAS las prendas del usuario y filtramos las de este armario
      const garmentsRes = await apiClient.get('/garments/');
      const closetGarments = garmentsRes.data.filter(g => g.closet === parseInt(id));
      setGarments(closetGarments);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("No se pudo cargar el armario.");
      navigate('/'); // Si falla, lo devolvemos al inicio
    }
  };

  // --- LA MAGIA DE LA IA ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Usamos FormData porque estamos enviando un archivo físico, no un JSON normal
    const formData = new FormData();
    formData.append('image', file);
    formData.append('closet_id', id);

    setIsScanning(true); // Mostramos el estado de carga
    try {
      // Llamamos a nuestro endpoint de Django con Gemini
      const response = await apiClient.post('/garments/scan/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Agregamos la nueva prenda escaneada a la lista visual
      setGarments([response.data, ...garments]);
      
      // Limpiamos el input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      // ¡Esto imprimirá el error exacto que nos manda Django!
      const errorExacto = error.response?.data?.error || "Error desconocido en el servidor";
      console.error("El backend dice:", errorExacto);
      
      alert("Error de Django: " + errorExacto);
    } finally {
      setIsScanning(false);
    }
  };

  if (!closet) return <div className="min-h-screen flex items-center justify-center">Cargando armario...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Barra de Navegación Superior */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center sticky top-0 z-10 gap-4">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-black font-bold">
          &larr; Volver
        </button>
        <h1 className="text-xl font-extrabold tracking-tight truncate border-l border-gray-300 pl-4">
          {closet.name}
        </h1>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Tus Prendas</h2>
            <p className="text-gray-500 mt-1">{closet.description || 'Aquí verás toda la ropa de este armario.'}</p>
          </div>
          
          {/* Botón de Escanear Prenda */}
          <div>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // ¡Truco para abrir cámara en móviles!
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isScanning}
              className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                isScanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:-translate-y-1'
              }`}
            >
              {isScanning ? '🤖 Analizando con IA...' : '📸 Escanear Prenda'}
            </button>
          </div>
        </div>

        {/* Grilla de Prendas */}
        {garments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">👕</div>
            <h3 className="text-lg font-medium text-gray-900">Armario vacío</h3>
            <p className="text-gray-500 mt-1">Sube tu primera foto para que la IA la clasifique automáticamente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {garments.map((garment) => (
              <div key={garment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                {/* Imagen de la prenda */}
                <div className="aspect-[3/4] bg-gray-100 relative">
                  {/* Como Django devuelve algo como "/media/foto.jpg", le concatenamos la base de tu servidor local */}
                  <img 
                    src={`http://127.0.0.1:8000${garment.path}`} 
                    alt={garment.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    {garment.category}
                  </div>
                </div>
                {/* Detalles de la IA */}
                <div className="p-4">
                  <h3 className="font-bold text-sm truncate" title={garment.name}>{garment.name}</h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2" title={garment.description}>
                    {garment.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}