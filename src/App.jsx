import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
// Páginas Públicas
import Login from './pages/registro/Login';
import Register from './pages/registro/Register';

// Páginas Privadas
import Dashboard from './pages/armario/Dashboard';
import ClosetDetail from './pages/armario/ClosetDetail';
import OutfitBuilder from './pages/armario/OutfitBuilder';
import OutfitDetail from './pages/armario/OutfitDetail';
import Profile from './pages/perfil/Profile';
import AIAdvisor from './pages/armario/AIAdvisor';

// --- NUESTRO NUEVO LAYOUT MAESTRO ---
function ProtectedLayout() {
  const token = localStorage.getItem('access_token');
  
  // Si no hay token, lo pateamos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos la plantilla maestra
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-indigo-200 selection:text-indigo-900">
      {/* El menú aparece UNA SOLA VEZ aquí para toda la app */}
      <Navbar /> 
      <Toaster position="top-center" reverseOrder={false} />
      {/* El <Outlet /> es el "agujero" donde React inyectará tus pantallas dinámicamente */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Pantalla completa, sin menú) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Privadas (Todas envueltas en el ProtectedLayout) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/outfits/new" element={<OutfitBuilder />} />
          <Route path="/closets/:id" element={<ClosetDetail />} />
          <Route path="/outfits/:id" element={<OutfitDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/advisor" element={<AIAdvisor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;