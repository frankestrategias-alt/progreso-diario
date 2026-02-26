import React, { useState } from 'react';
import { Users, Shield, ArrowRight, CheckCircle2, Trophy, MessageSquare, Info } from 'lucide-react';
import { getTeamByCode } from '../services/teamData';
import { TeamConfig } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface TeamViewProps {
    onJoinTeam: (code: string) => void;
    onBack: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onJoinTeam, onBack }) => {
    const { progress } = useAppContext();
    const currentTeamId = progress?.teamId;
    const [code, setCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [activeTeam, setActiveTeam] = useState<TeamConfig | null>(null);

    const handleJoin = () => {
        if (!code.trim()) return;
        setIsJoining(true);

        setTimeout(() => {
            const team = getTeamByCode(code);
            if (team) {
                setActiveTeam(team);
                onJoinTeam(team.id);
            } else {
                alert('Código de equipo no encontrado. Verifica con tu líder.');
            }
            setIsJoining(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
            <header className="relative flex items-center justify-center mb-8 h-12">
                <button onClick={onBack} className="absolute left-0 p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <ArrowRight className="rotate-180 text-slate-600" size={24} />
                </button>
                <h1 className="text-2xl font-black text-amber-600 tracking-tight">Estrategias de Equipo</h1>
            </header>

            {!currentTeamId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-24 h-24 bg-indigo-100 rounded-[32px] flex items-center justify-center mb-6 relative">
                        <Users size={48} className="text-indigo-600" />
                        <div className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-xl shadow-lg animate-bounce">
                            <Shield size={16} className="text-white fill-white/20" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Únete al sistema de crecimiento de tu equipo</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        Si tu líder tiene una licencia de <span className="font-black text-slate-600">Networker Pro</span>, ingresa el código de equipo para duplicar estrategias.
                    </p>


                    <div className="w-full space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="CÓDIGO DE EQUIPO"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-center font-black tracking-[0.2em] text-xl focus:border-indigo-500 transition-all outline-none uppercase"
                            />
                        </div>
                        <button
                            onClick={handleJoin}
                            disabled={!code || isJoining}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        >
                            {isJoining ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Validar Licencia <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>

                    <div className="mt-12 w-full">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="h-[1px] w-8 bg-amber-200"></span>
                            <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em]">
                                ¿Qué obtienes al unirte?
                            </h3>
                            <span className="h-[1px] w-8 bg-amber-200"></span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all active:scale-95 cursor-pointer">
                                <div className="shrink-0 w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <CheckCircle2 size={20} strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-800 leading-tight">Arranque Explosivo</p>
                                    <p className="text-[12px] text-slate-400 font-bold">Ruta rápida hacia el rango.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all active:scale-95 cursor-pointer">
                                <div className="shrink-0 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                    <CheckCircle2 size={20} strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-800 leading-tight">Efecto Lázaro</p>
                                    <p className="text-[12px] text-slate-400 font-bold">Reactiva socios "perdidos".</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all active:scale-95 cursor-pointer">
                                <div className="shrink-0 w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                    <CheckCircle2 size={20} strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-800 leading-tight">Máquina Incesante</p>
                                    <p className="text-[12px] text-slate-400 font-bold">Prospección 24/7 automática.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group hover:border-indigo-200 transition-all active:scale-95 cursor-pointer">
                                <div className="shrink-0 w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <CheckCircle2 size={20} strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[13px] font-black text-slate-800 leading-tight">Cierres en Piloto Automático</p>
                                    <p className="text-[12px] text-slate-400 font-bold">Seguimiento que convierte.</p>
                                </div>
                            </div>
                        </div>

                        {/* Mantra at the bottom with a subtle entrance animation */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 py-4 px-6 mt-12 mb-6 text-left italic rounded-r-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <p className="text-[13px] font-bold text-amber-900 leading-tight">
                                "Tu equipo avanza con estrategias, no con motivación."
                            </p>
                        </div>

                        {/* Leader Contact Section */}
                        <div className="mt-8 border-t border-slate-200 pt-8 w-full">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">¿Eres el líder de una organización?</p>
                            <button
                                onClick={() => window.open('https://wa.me/573134140978?text=' + encodeURIComponent('Hola, soy líder y me gustaría implementar el sistema de licencias para mi equipo en Networker Pro 🚀'), '_blank')}
                                className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors"
                            >
                                <MessageSquare size={16} />
                                Solicitar Licencia para mi Equipo
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                        <Users size={80} className="absolute -bottom-4 -right-4 text-white/10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-2">Equipo Activo</p>
                        <h2 className="text-3xl font-black tracking-tight mb-4 uppercase">{activeTeam?.name || 'Tu Equipo Oficial'}</h2>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl inline-flex text-xs font-bold uppercase tracking-widest border border-white/20">
                            <Shield size={14} className="text-amber-400 fill-amber-400" /> Licencia Verificada
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
                                <CheckCircle2 size={20} strokeWidth={3} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Arranque</p>
                            <p className="text-xs font-black text-slate-800">EXPLOSIVO</p>
                            <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Activo</span>
                        </div>

                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mb-3">
                                <CheckCircle2 size={20} strokeWidth={3} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Efecto</p>
                            <p className="text-xs font-black text-slate-800">LÁZARO</p>
                            <span className="mt-2 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Activo</span>
                        </div>

                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 mb-3">
                                <CheckCircle2 size={20} strokeWidth={3} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Máquina</p>
                            <p className="text-xs font-black text-slate-800">INCESANTE</p>
                            <span className="mt-2 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Activo</span>
                        </div>

                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
                                <CheckCircle2 size={20} strokeWidth={3} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cierres</p>
                            <p className="text-xs font-black text-slate-800">PRO</p>
                            <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Activo</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => window.open(`https://wa.me/${activeTeam?.leaderWhatsApp || ''}?text=` + encodeURIComponent(`Hola, necesito soporte de uno de los sistemas de equipo en Networker Pro 🚀 (ID: ${activeTeam?.id})`), '_blank')}
                            className="w-full bg-slate-900 text-white p-5 rounded-[28px] font-black shadow-lg flex items-center justify-between group active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <MessageSquare size={18} className="text-indigo-300" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs uppercase tracking-widest font-black text-white">Soporte Directo</p>
                                    <p className="text-[10px] text-white/50 font-bold uppercase">Chat con tu Líder</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => onJoinTeam('')}
                            className="w-full py-4 text-slate-400 font-bold text-xs hover:text-red-500 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 group/unlink"
                        >
                            <ArrowRight size={14} className="rotate-180 group-hover/unlink:-translate-x-1 transition-transform" />
                            Desvincular Licencia
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
