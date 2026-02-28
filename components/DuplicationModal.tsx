import React from 'react';
import { createPortal } from 'react-dom';
import { UserGoals } from '../types';
import { Share2, Check, X, ShieldCheck, Target, Trophy, Rocket } from 'lucide-react';

interface DuplicationModalProps {
    incomingGoals: UserGoals;
    onAccept: () => void;
    onCancel: () => void;
    previewMode?: boolean; // If true, we are the sender "confirming" before WA
}

export const DuplicationModal: React.FC<DuplicationModalProps> = ({
    incomingGoals, onAccept, onCancel, previewMode = false
}) => {
    return typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10">

                {/* Header Visual - Emerald Theme */}
                <div className="shrink-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-6 sm:p-8 text-white text-center relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white/20">
                            <Share2 size={32} className="text-white animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight leading-tight">
                            {previewMode ? '¡Firma tu Éxito!' : '¡Protocolo Detectado!'}
                        </h2>
                        <p className="text-emerald-50 text-xs font-bold uppercase tracking-[0.2em] mt-2">
                            {previewMode ? 'Confirma tu Visión Pro' : 'Configuración de Élite'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 space-y-5 overflow-y-auto">
                    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                        {incomingGoals.sponsorName && !previewMode ? (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-inner">
                                <p className="text-xs text-emerald-800 font-medium leading-relaxed italic">
                                    "Estás importando la visión estratégica de <strong className="font-black text-emerald-900">{incomingGoals.sponsorName}</strong>. ¡Confía en que serás su próximo gran caso de éxito!"
                                </p>
                            </div>
                        ) : null}

                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            {previewMode ? 'Tu sello de liderazgo:' : 'Estrategia a Clonar:'}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Target size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Compañía / Marca</p>
                                    <p className="font-black text-slate-800 uppercase">{incomingGoals.companyName || 'Independiente'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Contactos</p>
                                    <p className="text-xl font-black text-emerald-600">{incomingGoals.dailyContacts}</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Seguimientos</p>
                                    <p className="text-xl font-black text-emerald-600">{incomingGoals.dailyFollowUps}</p>
                                </div>
                            </div>

                            {incomingGoals.teamChallenge && (
                                <div className="pt-2 border-t border-slate-100 mt-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
                                        <Trophy size={10} className="text-amber-500" /> Reto Liderazgo:
                                    </p>
                                    <p className="text-xs font-medium text-slate-600 italic">"{incomingGoals.teamChallenge}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-[11px] text-center text-slate-400 font-medium px-4">
                        Al aceptar, se clonará esta configuración en tus metas. ¡Diseñado para tu éxito!
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onAccept}
                            className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {previewMode ? <Rocket size={20} /> : <Check size={20} />}
                            {previewMode ? 'Enviar a WhatsApp' : 'Activar Duplicación'}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={14} />
                            {previewMode ? 'Regresar' : 'Descartar cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    ) : null;
};
