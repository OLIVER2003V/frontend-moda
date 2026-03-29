// src/components/GarmentImage.jsx

// Ahora lee la URL base dinámicamente
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function GarmentImage({ path, alt, className = "w-full h-full object-cover" }) {
  
  if (!path) {
    return (
      <div className={`${className} bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-center p-2`}>
        Foto no disponible
      </div>
    );
  }

  // Si la foto viene de Cloudinary
  if (path.startsWith('http')) {
    return <img src={path} alt={alt} className={className} />;
  }

  // Si es una foto antigua local
  return <img src={`${BACKEND_BASE_URL}${path}`} alt={alt} className={className} />;
}