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
    age: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Estructuramos los datos como los espera tu backend de Django
      const payload = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        attributes: {
          gender: formData.gender,
          age: parseInt(formData.age) || null,
        }
      };

      await apiClient.post('/auth/register/', payload);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login'); // Redirigimos al login tras registrarse
    } catch (err) {
      // Esto imprimirá el error exacto de Django en la consola de tu navegador
      console.error("Error del servidor:", err.response?.data);
      
      // Y si Django nos manda un mensaje específico, lo mostramos en pantalla
      const mensajeDjango = err.response?.data?.error;
      setError(mensajeDjango || 'Hubo un error al registrarte. Verifica tus datos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a tu nuevo armario virtual
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
          <div className="rounded-md shadow-sm space-y-3">
            <input name="email" type="email" required placeholder="Correo electrónico" 
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              onChange={handleChange} />
            
            <input name="username" type="text" required placeholder="Nombre de usuario" 
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              onChange={handleChange} />

            <input name="password" type="password" required placeholder="Contraseña" 
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              onChange={handleChange} />
            
            <div className="flex gap-3">
              <input name="age" type="number" placeholder="Edad (Opcional)" 
                className="appearance-none rounded relative block w-1/2 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                onChange={handleChange} />
              
              <select name="gender" onChange={handleChange} 
                className="appearance-none rounded relative block w-1/2 px-3 py-2 border border-gray-300 text-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm">
                <option value="">Género (Opcional)</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
              Registrarse
            </button>
          </div>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-black hover:text-gray-800 underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}