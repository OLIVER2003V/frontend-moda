import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: '',
    age: '',
    stature: '',
    weight: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me/');
      const user = response.data;
      // Llenamos el formulario con los datos de Django
      setFormData({
        username: user.username || '',
        email: user.email || '',
        gender: user.attributes?.gender || '',
        age: user.attributes?.age || '',
        stature: user.attributes?.stature || '',
        weight: user.attributes?.weight || ''
      });
    } catch (error) {
      console.error("Error al cargar perfil", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Estructuramos el paquete igual que en el registro
      const payload = {
        username: formData.username,
        attributes: {
          gender: formData.gender || null,
          age: parseInt(formData.age) || null,
          stature: parseFloat(formData.stature) || null,
          weight: parseFloat(formData.weight) || null
        }
      };
      await apiClient.put('/auth/me/', payload);
toast.success("¡Perfil actualizado con éxito!"); // <-- ✨ Magia aquí
} catch (error) {
  console.error("Error al actualizar", error);
  toast.error("Hubo un error al guardar los cambios."); // <-- ✨ Y aquí
}finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro? Esta acción borrará tu cuenta, todos tus armarios y outfits para siempre. NO se puede deshacer."
    );
    
    if (confirmar) {
      try {
        await apiClient.delete('/auth/me/');
        // Destruimos las llaves locales
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        alert("Tu cuenta ha sido eliminada. Lamentamos verte partir.");
        navigate('/login');
      } catch (error) {
        console.error("Error al eliminar cuenta", error);
        alert("No se pudo eliminar la cuenta.");
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <div className="p-8 lg:p-12 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="flex items-center gap-6 mb-10 border-b border-gray-100 pb-8">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl shadow-lg">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Mi Perfil</h1>
              <p className="text-gray-500 mt-1">Actualiza tus datos físicos para que la IA mejore sus recomendaciones.</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
            
            {/* Sección: Cuenta */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Datos de la Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                  <input 
                    name="username" type="text" value={formData.username} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Correo (No editable)</label>
                  <input 
                    type="email" value={formData.email} disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Físico */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Perfil Físico</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                  <input 
                    name="age" type="number" value={formData.age} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="">...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estatura (cm)</label>
                  <input 
                    name="stature" type="number" step="0.01" value={formData.stature} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Peso (kg)</label>
                  <input 
                    name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-gray-100">
              <button 
                type="button" 
                onClick={handleDeleteAccount}
                className="text-red-500 font-bold hover:text-red-700 hover:underline px-4 py-2"
              >
                Eliminar Cuenta
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}