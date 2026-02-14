import React from 'react';
import { BarChart3, ArrowLeft, Trophy, Calendar } from 'lucide-react';
import { DailyProgress, UserGoals } from '../types';

interface StatsViewProps {
    progress: DailyProgress;
    goals: UserGoals;
    onBack: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ progress, goals, onBack }) => {
    // Get last 7 days of dates
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const history = progress.history || {};

    const maxVal = Math.max(
        ...last7Days.map(date => (history[date]?.contacts || 0) + (history[date]?.followUps || 0)),
        goals.dailyContacts + goals.dailyFollowUps,
        1 // avoid division by zero
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={onBack}
                    className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-slate-600 hover:bg-white/80 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <BarChart3 className="text-indigo-600" />
                    Mi Rendimiento
                </h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Semana</p>
                    <p className="text-3xl font-black text-slate-800">
                        {(Object.values(history) as any[]).reduce((acc: number, curr: any) => acc + (curr.contacts || 0) + (curr.followUps || 0), 0)}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-500 uppercase mt-1">
                        <Trophy size={10} />
                        <span>Acciones</span>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-white/40 shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Día Top</p>
                    <p className="text-3xl font-black text-slate-800">
                        {Math.max(...(Object.values(history) as any[]).map((h: any) => (h.contacts || 0) + (h.followUps || 0)), 0)}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-500 uppercase mt-1">
                        <Calendar size={10} />
                        <span>Récord</span>
                    </div>
                </div>
            </div>

            {/* Chart Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center justify-between">
                    Últimos 7 Días
                    <span className="text-[10px] text-slate-400 font-bold italic normal-case">Consistencia semanal</span>
                </h3>

                <div className="flex items-end justify-between h-48 gap-2 px-2">
                    {last7Days.map((date) => {
                        const dayData = history[date] || { contacts: 0, followUps: 0 };
                        const total = dayData.contacts + dayData.followUps;
                        const height = (total / maxVal) * 100;
                        const isToday = date === new Date().toISOString().split('T')[0];
                        const dayName = new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();

                        return (
                            <div key={date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                <div className="relative w-full flex flex-col items-center justify-end h-full">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {dayData.contacts}C + {dayData.followUps}S = {total}
                                    </div>

                                    {/* The Bar */}
                                    <div
                                        className={`w-full max-w-[12px] md:max-w-[16px] rounded-t-full transition-all duration-700 ease-out ${isToday ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-200 group-hover:bg-slate-300'
                                            }`}
                                        style={{ height: `${Math.max(4, height)}%` }}
                                    ></div>
                                </div>
                                <span className={`text-[9px] font-black tracking-tighter ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {dayName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Weekly Share Button */}
            <button
                onClick={() => {
                    const totalWeekly = (Object.values(history) as any[]).reduce((acc: number, curr: any) => acc + (curr.contacts || 0) + (curr.followUps || 0), 0);
                    const topDay = Math.max(...(Object.values(history) as any[]).map((h: any) => (h.contacts || 0) + (h.followUps || 0)), 0);

                    const shareText = `📊 *Mi Reporte Semanal de Ejecución* 📈\n\n🏆 Total Acciones: ${totalWeekly}\n🔥 Mejor Día: ${topDay} acciones\n🏢 Compañía: ${goals.companyName || 'MLM'}\n\n¡La consistencia es la madre del éxito! Sigue adelante. 💪🚀\n\nGenerado con: https://mlm-action-partner.vercel.app`;

                    if (navigator.share) {
                        navigator.share({
                            title: 'Mi Reporte Semanal',
                            text: shareText
                        }).catch(err => console.log('Error sharing', err));
                    } else {
                        navigator.clipboard.writeText(shareText);
                        alert('¡Reporte copiado al portapapeles!');
                    }
                }}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Trophy size={20} />
                Compartir Reporte Semanal
            </button>

            {/* Motivational Footnote */}
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100/50">
                <p className="text-xs text-blue-700 font-medium leading-relaxed italic text-center">
                    "No importa qué tan lento vayas, siempre y cuando no te detengas."
                </p>
            </div>
        </div>
    );
};
