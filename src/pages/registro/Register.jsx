import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    gender: '',
    age: '',
    stature: '', // Nuevo: Estatura
    weight: ''   // Nuevo: Peso
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Estructuramos los datos EXACTAMENTE como los espera tu backend Django
      const payload = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        attributes: {
          gender: formData.gender || null,
          age: parseInt(formData.age) || null,
          stature: parseFloat(formData.stature) || null, // Parseamos a decimal
          weight: parseFloat(formData.weight) || null    // Parseamos a decimal
        }
      };

      await apiClient.post('/auth/register/', payload);
      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error("Error de registro:", err.response?.data);
      const mensajeDjango = err.response?.data?.error;
      setError(mensajeDjango || 'Hubo un error al crear tu cuenta. Verifica los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-white">
      {/* Sección Izquierda: Formulario (Ahora invertimos el lado para que varíe del Login) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Únete a nosotros
            </h2>
            <p className="text-gray-500 text-base">
              Crea tu perfil físico para que la IA te asesore mejor.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-5">
              {/* --- DATOS DE CUENTA --- */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Datos de Cuenta</h3>
                
                <div className="space-y-4">
                  <input name="email" type="email" required placeholder="Correo Electrónico" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                    onChange={handleChange} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input name="username" type="text" required placeholder="Usuario" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                      onChange={handleChange} />
                    <input name="password" type="password" required placeholder="Contraseña" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                      onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* --- DATOS FÍSICOS (Para la IA) --- */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Perfil Físico (Opcional)</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">Estatura (cm)</label>
                    <input name="stature" type="number" step="0.01" placeholder="Ej: 175" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                      onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">Peso (kg)</label>
                    <input name="weight" type="number" step="0.1" placeholder="Ej: 70.5" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                      onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input name="age" type="number" placeholder="Edad" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                    onChange={handleChange} />
                  
                  <select name="gender" onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors text-gray-600">
                    <option value="">Género...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear mi Armario'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-black hover:text-gray-800 hover:underline transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sección Derecha: Imagen (Se oculta en celulares) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop" 
          alt="Ropa en perchas" 
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
        <div className="absolute bottom-12 right-12 text-white max-w-md z-10 text-right">
          <h2 className="text-4xl font-bold tracking-tight mb-3">
            La IA a tu medida.
          </h2>
          <p className="text-md text-gray-300 font-light">
            Tus medidas físicas nos ayudan a encontrar las proporciones perfectas para recomendarte outfits que realcen tu figura.
          </p>
        </div>
      </div>

    </div>
  );
}