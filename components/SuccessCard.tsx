import React, { useState } from 'react';
import { Share2, X, Check, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerMagic } from '../utils/magic';
import { trackEvent } from '../services/firebase';

interface SuccessCardProps {
    objection: string;
    response: string;
    onClose: () => void;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ objection, response, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Sonidos y confeti
        triggerMagic();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#34d399', '#fbbf24', '#6366f1']
        });

        const shareText = `🔥 *¡OBJECIÓN SUPERADA!* 🔥\n\n📌 *El Prospecto dijo:* "${objection}"\n🛡️ *Mi Respuesta Pro:* "${response}"\n\n_Generado con Networker Pro_ 🚀`;

        if (navigator.share) {
            try {
                trackEvent('share_success', { method: 'native' });
                await navigator.share({
                    title: 'Victoria de Cierre 🛡️',
                    text: shareText,
                    url: 'https://sistemapremium.netlify.app/?origen=app'
                });
            } catch (err) {
                // Si el usuario cancela o hay error en el menú nativo, vamos directo a WhatsApp
                trackEvent('share_success', { method: 'whatsapp_fallback' });
                directWhatsAppShare(shareText);
            }
        } else {
            trackEvent('share_success', { method: 'whatsapp_direct' });
            directWhatsAppShare(shareText);
        }
    };

    const directWhatsAppShare = (text: string) => {
        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

        // Intentamos abrir WhatsApp
        window.open(whatsappUrl, '_blank');

        // También copiamos al portapapeles por seguridad
        copyToClipboard(text);
    };

    const copyToClipboard = (text: string) => {
        try {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            });
        } catch (e) {
            console.error("Clipboard fail", e);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-[340px] animate-in zoom-in-95 duration-500">

                {/* Botón Cerrar Flotante */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors p-2"
                >
                    <X size={24} />
                </button>

                {/* LA TARJETA (ESTILO GEMA SIMPLIFICADA) */}
                <div className="bg-[#0b1222] rounded-[36px] overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] relative p-7">

                    {/* Brillo de fondo sutil */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />

                    {/* Icono de Victoria */}
                    <div className="flex flex-col items-center text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 transform rotate-3">
                            <Trophy size={32} className="text-white" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">¡Logro Desbloqueado!</p>
                        <h2 className="text-xl font-black text-white">Cierre Maestro</h2>
                    </div>

                    {/* Contenido Minimalista */}
                    <div className="space-y-6 mb-8 relative z-10">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">El Desafío:</span>
                            <p className="text-slate-300 text-sm font-bold italic line-clamp-2 opacity-80 leading-relaxed">"{objection}"</p>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                            <p className="text-white text-base font-bold leading-relaxed text-center italic">
                                "{response.length > 120 ? response.substring(0, 120) + '...' : response}"
                            </p>
                        </div>
                    </div>

                    {/* Botón de Acción Principal */}
                    <button
                        onClick={handleShare}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all relative overflow-hidden active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-900 hover:scale-[1.02]'
                            }`}
                    >
                        {copied ? (
                            <>¡Copiado! <Check size={18} /></>
                        ) : (
                            <>Inspirar Mi Equipo <Share2 size={18} /></>
                        )}
                    </button>

                    <p className="text-center text-white/20 text-[9px] mt-4 font-bold uppercase tracking-widest">
                        Compartir es liderar ✨
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SuccessCard;
