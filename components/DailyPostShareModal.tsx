import React from 'react';
import { Share2, Copy, Trophy, X } from 'lucide-react';

interface DailyPostShareModalProps {
    onClose: () => void;
    onWhatsAppShare: () => void;
    onNativeShare: () => void;
    onCopyShareText: () => void;
}

export const DailyPostShareModal: React.FC<DailyPostShareModalProps> = ({
    onClose,
    onWhatsAppShare,
    onNativeShare,
    onCopyShareText
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-20 hover:bg-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                            <Trophy size={40} className="text-amber-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-widest mb-2">¡Logro Diaro!</h3>
                        <p className="text-indigo-100 text-sm font-medium">Comparte tu disciplina con el equipo para inspirar a otros líderes.</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 space-y-3">
                    <button
                        onClick={onWhatsAppShare}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <span className="text-xl">📲</span> Compartir por WhatsApp
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onNativeShare}
                            className="bg-white border-2 border-slate-100 p-4 rounded-2xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Share2 size={16} className="text-indigo-500" /> Otros
                        </button>
                        <button
                            onClick={onCopyShareText}
                            className="bg-white border-2 border-slate-100 p-4 rounded-2xl text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Copy size={16} className="text-slate-400" /> Copiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
