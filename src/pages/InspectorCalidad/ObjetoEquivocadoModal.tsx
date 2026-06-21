import { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

interface ObjetoEquivocadoModalProps {
  onClose: () => void;
  onGuardar: (tipo: string, descripcion: string, fotoAdjunta: boolean, fotoUrl?: string) => void;
}

export default function ObjetoEquivocadoModal({ onClose, onGuardar }: ObjetoEquivocadoModalProps) {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoAdjunta, setFotoAdjunta] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona una imagen válida.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // Comprimir la imagen
            setFotoUrl(dataUrl);
            setFotoAdjunta(true);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Objeto Equivocado</h2>
            <p className="text-xs text-slate-500 mt-0.5">Registra el objeto no perteneciente a la solicitud</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Objeto</label>
            <input
              type="text"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              placeholder="Ej: Electrónico, Accesorio, Ropa..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Describe el objeto encontrado, estado, características..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Evidencia Fotográfica</label>
            {fotoAdjunta && fotoUrl ? (
              <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img src={fotoUrl} alt="Objeto equivocado" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-700">Imagen adjunta</span>
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 px-4 py-3 w-full border-2 border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-50 rounded-xl text-slate-500 hover:text-sky-600 text-sm font-semibold transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                Subir Foto
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onGuardar(tipo, descripcion, fotoAdjunta, fotoUrl)}
            className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-sm font-semibold transition-all shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
