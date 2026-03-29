import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import GarmentImage from '../../components/GarmentImage'; // Ajusta la ruta si es necesario

export default function OutfitBuilder() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]);
  const [selectedGarments, setSelectedGarments] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);

  // Orden lógico para el maniquí (qué va arriba y qué va abajo)
  const categoryOrder = {
    'OUTERWEAR': 1, // Chamarras/Abrigos
    'TOP': 2,       // Camisas/Poleras
    'DRESS': 3,     // Vestidos
    'BOTTOM': 4,    // Pantalones/Shorts
    'FOOTWEAR': 5,  // Zapatos
    'ACCESSORY': 6  // Accesorios
  };

  useEffect(() => {
    fetchGarments();
  }, []);

  const fetchGarments = async () => {
    try {
      const response = await apiClient.get('/garments/');
      setGarments(response.data);
    } catch (error) {
      console.error("Error al cargar prendas:", error);
    }
  };

  const toggleGarment = (garment) => {
    const isSelected = selectedGarments.some(g => g.id === garment.id);
    if (isSelected) {
      // Si ya está seleccionado, lo quitamos
      setSelectedGarments(selectedGarments.filter(g => g.id !== garment.id));
    } else {
      // Si no está, lo agregamos
      setSelectedGarments([...selectedGarments, garment]);
    }
  };

  const handleSaveOutfit = async () => {
    if (selectedGarments.length === 0) return alert("Selecciona al menos una prenda.");
    if (!outfitName.trim()) return alert("Ponle un nombre a tu outfit.");

    setIsSaving(true);
    try {
      // Enviamos el formato exacto que espera nuestro nuevo serializer en Django
      const payload = {
        name: outfitName,
        garment_ids: selectedGarments.map(g => g.id)
      };
      await apiClient.post('/outfits/', payload);
      alert("¡Outfit guardado con éxito!");
      navigate('/'); // Volvemos al dashboard
    } catch (error) {
      console.error("Error al guardar outfit:", error);
      alert("Hubo un error al guardar tu combinación.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtramos la ropa según la pestaña seleccionada
  const filteredGarments = activeFilter === 'ALL' 
    ? garments 
    : garments.filter(g => g.category === activeFilter);

  // Ordenamos la ropa del maniquí de la cabeza a los pies
  const sortedMannequin = [...selectedGarments].sort((a, b) => 
    (categoryOrder[a.category] || 99) - (categoryOrder[b.category] || 99)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navegación Superior */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-black font-bold">
            &larr; Volver
          </button>
          <h1 className="text-xl font-extrabold tracking-tight border-l border-gray-300 pl-4">
            Creador de Outfits
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Nombre de tu look (Ej: Casual Domingo)" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none w-64"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
          />
          <button 
            onClick={handleSaveOutfit}
            disabled={isSaving || selectedGarments.length === 0}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isSaving ? 'Guardando...' : 'Guardar Outfit'}
          </button>
        </div>
      </nav>

      {/* Pantalla Dividida */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PANEL IZQUIERDO: Tu Armario (Selector) */}
        <div className="w-2/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Filtros */}
          <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
            {['ALL', 'TOP', 'BOTTOM', 'OUTERWEAR', 'FOOTWEAR', 'ACCESSORY'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeFilter === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'TODO' : cat}
              </button>
            ))}
          </div>

          {/* Grilla de Ropa */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
            {filteredGarments.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">No tienes prendas en esta categoría.</div>
            ) : (
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGarments.map(garment => {
                  const isSelected = selectedGarments.some(g => g.id === garment.id);
                  return (
                    <div 
                      key={garment.id} 
                      onClick={() => toggleGarment(garment)}
                      className={`relative bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all ${
                        isSelected ? 'border-black ring-4 ring-black/10 scale-[0.98]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <GarmentImage 
                            path={garment.path} 
                            alt={garment.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" // Usa las mismas clases de Tailwind que tenías
                            />
                      </div>
                      {/* Checkmark verde si está seleccionado */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1 shadow-md">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      )}
                      <div className="p-2 text-center">
                        <p className="text-xs font-bold truncate">{garment.name}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: El Maniquí (Visualizador) */}
        <div className="w-1/3 bg-gray-100 p-8 flex flex-col items-center overflow-y-auto">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Tu Maniquí</h2>
          
          {sortedMannequin.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center px-8">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <p>Haz clic en las prendas de la izquierda para armar tu outfit aquí.</p>
            </div>
          ) : (
            <div className="w-full max-w-xs space-y-4">
              {sortedMannequin.map(garment => (
                <div key={garment.id} className="relative bg-white rounded-2xl shadow-lg p-2 animate-fade-in-up">
                  <img src={`http://127.0.0.1:8000${garment.path}`} alt={garment.name} className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-100">
                    <p className="text-[10px] font-black text-black tracking-wider">{garment.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}