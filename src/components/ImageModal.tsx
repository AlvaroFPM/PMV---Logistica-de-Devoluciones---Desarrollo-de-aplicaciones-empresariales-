import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          title="Cerrar (o haz clic fuera de la imagen)"
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={src} 
          alt="Vista ampliada" 
          className="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl object-contain bg-black/20"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking on the image itself
        />
      </div>
    </div>
  );
}
