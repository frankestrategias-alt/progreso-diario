import React, { useState } from 'react';
import { Shield, BookOpen, Music, Users, ArrowRight, Settings, Plus, Save, Crown } from 'lucide-react';

interface LeaderDashboardProps {
    onBack: () => void;
}

export const LeaderDashboard: React.FC<LeaderDashboardProps> = ({ onBack }) => {
    const [teamName, setTeamName] = useState('Organización Diamante');
    const [teamSecret, setTeamSecret] = useState('El éxito es la suma de pequeños esfuerzos diarios.');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('¡Configuración de equipo guardada!');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col pb-24">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <ArrowRight className="rotate-180 text-slate-600" size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Panel de Líder</h1>
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                            <Crown size={10} /> Cuenta Elite Business
                        </p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">
                    LB
                </div>
            </header>

            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users size={120} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Estado de Red</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-black tracking-tighter mb-1">128</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Socios Activos</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-emerald-400 mb-1">+12%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Este mes</p>
                        </div>
                    </div>
                </div>

                {/* Team Customization */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Settings size={16} className="text-indigo-600" /> Personalización
                    </h3>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nombre del Equipo</label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Secreto / Mantra del Día</label>
                            <textarea
                                value={teamSecret}
                                onChange={(e) => setTeamSecret(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Materials & Resources */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2"><BookOpen size={16} className="text-indigo-600" /> Materiales</span>
                        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                            <Plus size={16} />
                        </button>
                    </h3>

                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <BookOpen size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Guiones de Cierre 2024</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-300" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm border-l-4 border-l-indigo-500">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Music size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Audio: Mentalidad Invencible</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-300" />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <><Save size={18} /> Guardar Configuración</>
                    )}
                </button>
            </div>
        </div>
    );
};
