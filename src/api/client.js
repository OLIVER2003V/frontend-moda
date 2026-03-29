import axios from 'axios';

// 1. Leemos la variable de entorno de Vite.
// Si no la encuentra, usa localhost como "salvavidas" para que nada se rompa.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// 2. Creamos la instancia de Axios apuntando dinámicamente
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // <-- Aquí inyectamos la variable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Si el usuario ya hizo login y tiene un token, se lo agregamos a cada petición automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;