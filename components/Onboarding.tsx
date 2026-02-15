import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Trophy, Rocket } from 'lucide-react';


interface OnboardingProps {
    onComplete: (company: string, niche: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [company, setCompany] = useState('');
    const [niche, setNiche] = useState('Salud y Bienestar');

    const niches = [
        "Salud y Bienestar",
        "Belleza y Cuidado Personal",
        "Viajes y Estilo de Vida",
        "Educación / Academias",
        "Productos Físicos",
        "Otro"
    ];

    const steps = [
        {
            title: "Tu Mentor IA en tu Bolsillo",
            description: "Genera mensajes profesionales para contactar prospectos y dar seguimiento en segundos usando inteligencia artificial.",
            icon: <Sparkles className="text-amber-500" size={48} />,
            color: "from-amber-400 to-orange-500"
        },
        {
            title: "Resultados Imparables 🏆",
            description: "No trabajes a ciegas. Rastrea tus acciones, rompe tus propios récords y asegura tu éxito diario.",
            icon: <Trophy className="text-emerald-500" size={48} />,
            color: "from-emerald-400 to-teal-500"
        },
        {
            title: "Duplica Tu Producción 💎",
            description: "La herramienta definitiva para firmar más socios, subir de rango y duplicar tu equipo.",
            icon: <Rocket className="text-indigo-500" size={48} />,
            color: "from-indigo-400 to-purple-500",
            isForm: false
        }
    ];

    const currentStep = steps[step - 1];

    const nextStep = () => {
        if (step < steps.length) {
            setStep(step + 1);
        } else {
            // Default values since we removed the form
            onComplete("Mi Negocio", "Salud y Bienestar");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                <div className={`h-48 bg-gradient-to-br ${currentStep.color} flex items-center justify-center p-8 transition-all duration-500`}>
                    <div className="bg-white/20 p-6 rounded-[32px] backdrop-blur-md shadow-inner">
                        {currentStep.icon}
                    </div>
                </div>

                <div className="p-8 pb-10 text-center">
                    <div className="flex justify-center gap-2 mb-6">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'w-8 bg-slate-800' : 'w-2 bg-slate-200'}`}
                            />
                        ))}
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-4 leading-tight">
                        {currentStep.title}
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed mb-10 whitespace-pre-line">
                        {currentStep.description}
                    </p>

                    <button
                        onClick={nextStep}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200"
                    >
                        {step === steps.length ? "¡A COMENZAR!" : "SIGUIENTE"}
                        {step === steps.length ? <CheckCircle2 size={24} /> : <ArrowRight size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
