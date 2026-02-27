import React from 'react';
import { Share2, X, Rocket, Lock, Sparkles, LockKeyhole } from 'lucide-react';

interface ShareToolModalProps {
    onClose: () => void;
    onShare: () => void;
}

export const ShareToolModal: React.FC<ShareToolModalProps> = ({ onClose, onShare }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Background: Deep Space Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4338ca]"></div>

                {/* Stars/Noise Overlay (CSS Only) */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 transition-colors border border-white/10"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 p-6 pt-10 flex flex-col items-center text-center">
                    {/* Rocket Icon Container */}
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-indigo-500 blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-gradient-to-b from-white/10 to-transparent p-6 rounded-full border border-white/20 backdrop-blur-sm">
                            <Rocket size={48} className="text-white animate-[bounce_3s_infinite]" />
                        </div>
                        {/* Sparkles around rocket */}
                        <Sparkles className="absolute -top-2 -right-2 text-amber-300 animate-pulse" size={20} />
                        <Sparkles className="absolute -bottom-2 -left-2 text-indigo-300 animate-pulse" size={16} />
                    </div>

                    <div className="max-w-[340px] mx-auto">
                        <h3 className="text-[22px] font-black text-white mb-4 leading-tight">
                            Crecer solo toma tiempo.<br />
                            Duplicar acelera todo.
                        </h3>
                    </div>

                    {/* Description text - Professional Harmony */}
                    <p className="text-indigo-100/70 text-[13px] font-medium leading-relaxed mb-6 px-4">
                        Hoy puedes ayudar a alguien<br />
                        a crecer contigo.
                    </p>

                    {/* Primary Share Button */}
                    <button
                        onClick={onShare}
                        className="w-full py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-[28px] text-white font-black uppercase tracking-[0.15em] text-sm shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-95 group/btn"
                    >
                        <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
                        Compartir esta<br />herramienta
                    </button>

                    {/* Curiosity Hook (Lock) - Custom Premium Polish */}
                    <div className="mt-6 flex items-center gap-5 bg-black/40 px-7 py-5 rounded-[22px] border border-white/10 w-full">
                        <div className="text-indigo-400 flex-shrink-0">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2ZM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V10H9V7ZM12 18C11.17 18 10.5 17.33 10.5 16.5C10.5 15.67 11.17 15 12 15C12.83 15 13.5 15.67 13.5 16.5C13.5 17.33 12.83 18 12 18Z" />
                            </svg>
                        </div>
                        <p className="text-[8.5px] text-indigo-200 font-black uppercase tracking-widest leading-[1.8] text-left">
                            Al compartir, activas nuevas<br />
                            funciones de crecimiento
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
