import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListChecks, SendHorizontal, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerMagic } from '../utils/magic';
import { ViewState } from '../types';

interface Task {
    id: string;
    name: string;
    completed: boolean;
    createdAt: number; // For lead temperature
}

interface TaskTrackerProps {
    onNavigate?: (view: ViewState) => void;
    onAddPoints?: (amount: number) => void;
}

export const TaskTracker: React.FC<TaskTrackerProps> = ({ onNavigate, onAddPoints }) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('dailyTasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [newTaskName, setNewTaskName] = useState('');

    useEffect(() => {
        localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!newTaskName.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            name: newTaskName,
            completed: false,
            createdAt: Date.now()
        };
        setTasks([...tasks, newTask]);
        setNewTaskName('');
    };

    const toggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task && !task.completed) {
            // Give reward on first completion
            if (onAddPoints) onAddPoints(5);
            triggerMagic();
            confetti({
                particleCount: 80,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#10b981', '#34d399', '#ffffff']
            });
        }
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTasks(tasks.filter(t => !t.completed));
    };

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-300 animate-in fade-in slide-in-from-bottom duration-500 relative overflow-hidden group transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent pointer-events-none" />

            {tasks.length > 0 && (
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
                            <ListChecks className="text-emerald-500" size={24} />
                            Mi Lista de Hoy
                        </h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-8">Acción enfocada</p>
                    </div>
                    {tasks.some(t => t.completed) && (
                        <button
                            onClick={clearCompleted}
                            className="text-[10px] font-black text-slate-400 hover:text-red-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest transition-all active:scale-95"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            )}

            <div className="flex gap-3 mb-6 items-stretch relative z-10">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Nombre del prospecto..."
                        className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-5 py-5 text-sm font-bold text-slate-900 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Zap size={14} className={`transition-colors ${newTaskName ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`} fill="currentColor" />
                    </div>
                </div>
                <button
                    onClick={addTask}
                    disabled={!newTaskName.trim()}
                    className="w-16 h-auto bg-slate-900 text-white rounded-2xl hover:bg-black disabled:opacity-20 transition-all shadow-xl shadow-slate-200 flex items-center justify-center shrink-0 active:scale-95 border-b-4 border-slate-700 hover:border-slate-800 border border-slate-300"
                >
                    <Plus size={28} strokeWidth={4} />
                </button>
            </div>

            <div className="space-y-3 relative z-10">
                {tasks.length === 0 ? (
                    <div className="flex items-center gap-4 py-6 bg-slate-50/50 rounded-[28px] border border-slate-300 transition-all hover:bg-white hover:border-indigo-200 px-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                            <Zap size={24} className="text-amber-400" fill="currentColor" />
                        </div>
                        <div className="text-left">
                            <p className="text-[13px] text-slate-800 font-black uppercase tracking-tight leading-tight">Tu lista está vacía</p>
                            <p className="text-[12px] text-slate-400 font-bold mt-1">
                                Añade a alguien ahora
                            </p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between p-4.5 rounded-[22px] border-2 transition-all duration-300 relative overflow-hidden group/item ${task.completed
                                ? 'bg-slate-50/80 border-slate-100 opacity-60'
                                : 'bg-white border-slate-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.08)] hover:border-indigo-200 hover:-translate-y-0.5'
                                }`}
                        >
                            {/* Subtle accent line for active tasks */}
                            {!task.completed && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/10 group-hover/item:w-1.5 transition-all" />
                            )}

                            <div className="flex items-center gap-4 overflow-hidden flex-1 relative z-10">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100'
                                        : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:scale-110'
                                        }`}
                                >
                                    {task.completed && <Check size={20} strokeWidth={4} />}
                                </button>
                                <span className={`text-[15px] font-black text-slate-800 truncate tracking-tight ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                    {task.name}
                                </span>
                                {!task.completed && (() => {
                                    const ageHours = (Date.now() - task.createdAt) / (1000 * 60 * 60);
                                    if (ageHours >= 24 && ageHours <= 48) {
                                        return (
                                            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                                                🔥 CALIENTE
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {!task.completed && (
                                    <>
                                        <button
                                            onClick={() => onNavigate && onNavigate('CONTACT')}
                                            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                                            title="Enviar Mensaje"
                                        >
                                            <SendHorizontal size={18} />
                                        </button>
                                        <button
                                            onClick={() => onNavigate && onNavigate('OBJECTIONS')}
                                            className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all active:scale-90"
                                            title="Ver Objeciones"
                                        >
                                            <ShieldCheck size={18} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => removeTask(task.id)}
                                    className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
