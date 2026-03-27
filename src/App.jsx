import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/registro/Login';
import Register from './pages/registro/Register';
import Dashboard from './pages/armario/Dashboard';
import ClosetDetail from './pages/armario/ClosetDetail';

// Este es un "Guardia de Ruta" (Route Guard). 
// Revisa si hay un token; si no lo hay, patea al usuario a la pantalla de Login.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas Privadas (Protegidas) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Rutas Privadas (Protegidas) */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* NUEVA RUTA: Recibe el ID del armario dinámicamente */}
        <Route path="/closets/:id" element={<ProtectedRoute><ClosetDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;