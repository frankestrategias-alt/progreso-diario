import React, { useState } from 'react';
import { Download, X, Smartphone, Zap, Share2, Info } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallPrompt: React.FC = () => {
    const { isInstallable, isIOS, isStandalone, promptInstall } = useInstallPrompt();
    const [isVisible, setIsVisible] = useState(true); // Default to true for immediate Pro look
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [showFallbackInstructions, setShowFallbackInstructions] = useState(false);

    // If already installed, don't show anything
    if (isStandalone) return null;

    const handleAction = () => {
        if (isIOS) {
            setShowIOSInstructions(true);
        } else if (isInstallable) {
            promptInstall();
        } else {
            // Fallback for browsers where beforeinstallprompt hasn't fired or isn't supported
            setShowFallbackInstructions(true);
        }
    };

    return (
        <>
            {/* PRO FLOATING BUTTON (FAB) - Always visible if not standalone */}
            <div className="fixed bottom-[100px] right-7 z-[90] animate-in zoom-in spin-in-12 duration-1000">
                <button
                    onClick={handleAction}
                    className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all active:scale-90 relative group border-2 border-white/20"
                >
                    <Download size={24} className="group-hover:translate-y-0.5 transition-transform" />

                    {/* Pulsing indicator */}
                    <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 pointer-events-none"></div>

                    {/* Tooltip on hover */}
                    <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-xl">
                        INSTALAR APP PRO 🚀
                    </div>
                </button>
            </div>

            {/* Android/Chrome Fallback Modal */}
            {showFallbackInstructions && (
                <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white text-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom">
                        <button onClick={() => setShowFallbackInstructions(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4"><Info size={32} className="text-slate-600" /></div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Instalación Manual</h3>
                            <p className="text-sm text-slate-500 font-medium">Usa el menú de tu navegador para instalar.</p>
                        </div>
                        <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-sm font-bold text-slate-700">1. Toca los <strong>tres puntos (⋮)</strong> o el icono de <strong>compartir</strong>.</p>
                            <p className="text-sm font-bold text-slate-700">2. Selecciona <strong>"Instalar App"</strong> o <strong>"Agregar a Inicio"</strong>.</p>
                        </div>
                        <button onClick={() => setShowFallbackInstructions(false)} className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] uppercase tracking-widest text-xs">¡Entendido!</button>
                    </div>
                </div>
            )}

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white text-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom">
                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Smartphone size={32} className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Instalar en tu iPhone</h3>
                            <p className="text-sm text-slate-500 font-medium">Sigue estos pasos para tener acceso directo.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="bg-white p-2.5 rounded-xl shadow-sm"><Share2 size={24} className="text-blue-500" /></div>
                                <p className="text-sm font-bold text-slate-700">1. Toca el botón <strong>Compartir</strong> abajo.</p>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="bg-white p-2.5 rounded-xl shadow-sm"><Smartphone size={24} className="text-slate-800" /></div>
                                <p className="text-sm font-bold text-slate-700">2. Selecciona <strong>"Agregar al Inicio"</strong>.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            ¡Entendido!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
