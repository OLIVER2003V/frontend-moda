import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function AIAdvisor() {
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  
  // Necesitamos cargar toda tu ropa en el fondo para poder mostrar las fotos que la IA elija
  const [allGarments, setAllGarments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargamos la ropa apenas abres la pantalla
    apiClient.get('/garments/')
      .then(res => setAllGarments(res.data))
      .catch(err => console.error("Error al cargar ropa:", err));
  }, []);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!occasion.trim()) return;

    setIsThinking(true);
    setSuggestion(null); // Limpiamos la sugerencia anterior si la hubiera

    try {
      const response = await apiClient.post('/advise/', { occasion });
      setSuggestion(response.data);
    } catch (error) {
      console.error("Error de la IA:", error.response?.data);
      const errorMsg = error.response?.data?.error || "Hubo un cortocircuito en el cerebro de la IA. Intenta de nuevo.";
      toast.error(errorMsg);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSaveOutfit = async () => {
    setIsSaving(true);
    try {
      await apiClient.post('/outfits/', {
        name: suggestion.name,
        garment_ids: suggestion.garment_ids
      });
      toast.success("¡Look guardado en tu Dashboard!");
      navigate('/');
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("No pudimos guardar el outfit.");
      setIsSaving(false);
    }
  };

  // Filtramos las fotos de tu armario que coincidan con los IDs que eligió la IA
  const suggestedGarments = suggestion 
    ? allGarments.filter(g => suggestion.garment_ids.includes(g.id))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      

      <div className="flex-1 flex flex-col items-center p-8 lg:p-12 max-w-4xl mx-auto w-full">
        
        {/* Cabecera */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-black/20">
            ✨
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Tu Estilista Personal
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Cuéntame a dónde vas, cómo está el clima o qué estilo buscas. Analizaré tu armario y tu perfil físico para vestirte impecable.
          </p>
        </div>

        {/* Buscador Mágico */}
        <form onSubmit={handleAskAI} className="w-full relative mb-12">
          <input 
            type="text" 
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="Ej: Tengo una cena elegante de negocios y hace mucho frío..."
            disabled={isThinking}
            className="w-full px-8 py-5 pr-40 rounded-full border-2 border-gray-200 shadow-sm text-lg focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all disabled:bg-gray-100 disabled:opacity-70"
          />
          <button 
            type="submit"
            disabled={isThinking || !occasion.trim()}
            className="absolute right-3 top-3 bottom-3 bg-black text-white px-8 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isThinking ? 'Pensando...' : 'Asesorarme'}
          </button>
        </form>

        {/* Animación de Carga (Esqueleto) */}
        {isThinking && (
          <div className="w-full bg-white rounded-3xl p-10 shadow-sm border border-gray-100 animate-pulse text-center">
            <div className="text-5xl mb-6 animate-bounce">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analizando tu armario...</h3>
            <p className="text-gray-400">Cruzando datos con tu perfil y las tendencias actuales.</p>
          </div>
        )}

        {/* Resultado de la IA */}
        {suggestion && !isThinking && (
          <div className="w-full bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 animate-fade-in-up">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-8 gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-black tracking-widest uppercase rounded-full mb-3">
                  Selección de la IA
                </span>
                <h2 className="text-3xl font-black text-gray-900">{suggestion.name}</h2>
              </div>
              <button 
                onClick={handleSaveOutfit}
                disabled={isSaving}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-transform hover:-translate-y-0.5 shadow-md disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : '💾 Guardar este Outfit'}
              </button>
            </div>

            <div className="mb-10 bg-gray-50 p-6 rounded-2xl border-l-4 border-black">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Por qué te favorece:</h4>
              <p className="text-gray-800 text-lg italic leading-relaxed">
                "{suggestion.explanation}"
              </p>
            </div>

            {/* Prendas Sugeridas */}
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Prendas a utilizar:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedGarments.map(garment => (
                <div key={garment.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-[4/5] bg-gray-200 relative">
                    <img 
                      src={garment.path?.startsWith('http') ? garment.path : `http://127.0.0.1:8000${garment.path}`}
                      alt={garment.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm">
                      {garment.category}
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-bold text-sm text-gray-900 truncate">{garment.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {suggestedGarments.length === 0 && (
              <p className="text-red-500 text-center font-bold">
                Ups. La IA devolvió IDs de prendas que no encontramos en tu armario.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
}