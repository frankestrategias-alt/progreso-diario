import React, { useState } from 'react';
import { X, ChevronRight, CheckCircle2, Zap, MessageCircle, Megaphone, ChevronLeft, UserPlus } from 'lucide-react';

interface HelpModalProps {
    onClose: () => void;
}

const STEPS = [
    {
        title: "Tu Mentor de Bolsillo 🤖",
        desc: "Olvídate de la improvisación. La Inteligencia Artificial trabaja por ti creando guiones probados que generan resultados.",
        icon: <Zap size={48} className="text-amber-500" />,
        color: "bg-amber-50"
    },
    {
        title: "Paso 1: Invitar ⚡",
        desc: "Inicia conversaciones profesionales sin miedo. Usa los guiones de IA para despertar curiosidad e invitar nuevos prospectos.",
        icon: <UserPlus size={48} className="text-emerald-500" />,
        color: "bg-emerald-50"
    },
    {
        title: "Paso 2: Seguimiento 🎯",
        desc: "El dinero está en el seguimiento. Gestiona tus conversaciones abiertas y no dejes que ningún interesado se escape.",
        icon: <MessageCircle size={48} className="text-blue-500" />,
        color: "bg-blue-50"
    },
    {
        title: "Paso 3: Contenido 📢",
        desc: "Atrae líderes creando contenido magnético. Usa la IA para escribir posts que generen interés en tu negocio hoy mismo.",
        icon: <Megaphone size={48} className="text-pink-500" />,
        color: "bg-pink-50"
    }
];

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm relative overflow-hidden flex flex-col h-[500px]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 pb-0 text-center relative overflow-hidden">

                    <div key={currentStep} className={`flex flex-col items-center animate-in duration-300 ${direction > 0 ? 'slide-in-from-right-10' : direction < 0 ? 'slide-in-from-left-10' : 'zoom-in'}`}>
                        <div className={`w-32 h-32 rounded-[32px] ${STEPS[currentStep].color} flex items-center justify-center mb-8 shadow-inner`}>
                            {STEPS[currentStep].icon}
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
                            {STEPS[currentStep].title}
                        </h2>

                        <p className="text-slate-500 font-medium leading-relaxed px-2">
                            {STEPS[currentStep].desc}
                        </p>
                    </div>

                </div>

                {/* Footer / Controls */}
                <div className="p-8 pt-0 mt-auto">
                    {/* Dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrev}
                                className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {currentStep === STEPS.length - 1 ? '¡VAMOS!' : 'SIGUIENTE'}
                            {currentStep < STEPS.length - 1 && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
