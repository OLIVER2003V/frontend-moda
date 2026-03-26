import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/registro/Login';
import Register from './pages/registro/Register';

// Un componente temporal para el inicio
function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">¡Bienvenido a tu Armario! 👗👖</h1>
        <p className="text-gray-600">Sprint 1 completado con éxito.</p>
        <button 
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          }}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;