import React, { useState, useRef } from 'react';
import { Send, Sparkles, Loader2, UserPlus, Camera, X } from 'lucide-react';
import { generateContactScript } from '../services/geminiService';
import { ActionCard } from '../components/ActionCard';

interface ContactViewProps {
  onRecordAction: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onRecordAction }) => {
  const [context, setContext] = useState('');
  const [platform, setPlatform] = useState('WhatsApp');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setResults([]);
    
    // In a real app, we might analyze the image here using AI vision capabilities
    // For now, we generate the script based on text context
    const response = await generateContactScript(context, platform);
    const scripts = response.split('---').map(s => s.trim()).filter(s => s.length > 0);
    
    setResults(scripts);
    setLoading(false);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      
      {/* Inline Styles for Custom Animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 2s ease infinite;
          }
        `}
      </style>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Photo Section */}
        <div className="flex flex-col items-center mb-6">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                capture="user"
                className="hidden"
            />
            
            <div className="relative">
                {photo ? (
                    <div className="relative group">
                        <img 
                            src={photo} 
                            alt="Prospecto" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-sm"
                        />
                        <button 
                            onClick={() => setPhoto(null)}
                            className="absolute -top-1 -right-1 bg-slate-500 text-white p-1 rounded-full hover:bg-red-500 shadow-sm transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full hover:bg-emerald-600 shadow-sm transition-colors"
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 bg-slate-50 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all group"
                    >
                        <UserPlus size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" />
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600">FOTO</span>
                    </button>
                )}
            </div>
            {photo && <p className="text-xs text-slate-400 mt-2 font-medium">Prospecto Identificado</p>}
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-emerald-500" size={20} />
          ¿A quién vas a contactar?
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Contexto breve</label>
            <input 
              type="text" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ej: Amigo de la secundaria, Conocido del gimnasio..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Plataforma</label>
            <div className="flex gap-2 flex-wrap">
              {['WhatsApp', 'Instagram', 'Facebook', 'En persona'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    platform === p 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!context || loading}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all relative overflow-hidden ${
              loading 
                ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient-x text-white' 
                : !context 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {loading ? <Sparkles className="animate-spin" size={20}/> : <Sparkles size={20} />}
            {loading ? 'Creando Magia...' : 'Generar Ideas'}
          </button>
        </div>
      </div>

      {/* SKELETON LOADER (Shown during loading) */}
      {loading && (
        <div className="space-y-4 mt-6">
            <h3 className="text-sm font-bold text-emerald-500/50 uppercase tracking-wider mb-3 ml-1 animate-pulse">
                Analizando perfil...
            </h3>
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden h-28">
                    {/* Background Structure */}
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-50 rounded w-full"></div>
                        <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                    </div>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }}></div>
                </div>
            ))}
        </div>
      )}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Opciones Sugeridas</h3>
          {results.map((script, idx) => (
            <ActionCard 
                key={idx} 
                text={script} 
                onCopy={onRecordAction} 
            />
          ))}
          <p className="text-xs text-center text-slate-400 mt-4">
            Recuerda: El objetivo es abrir la puerta, no tirar la pared. Personaliza el mensaje.
          </p>
        </div>
      )}

    </div>
  );
};