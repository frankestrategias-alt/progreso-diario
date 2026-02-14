import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListChecks } from 'lucide-react';
import { triggerMagic } from '../utils/magic';

interface Task {
    id: string;
    name: string;
    completed: boolean;
}

export const TaskTracker: React.FC = () => {
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
            completed: false
        };
        setTasks([...tasks, newTask]);
        setNewTaskName('');
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTasks(tasks.filter(t => !t.completed));
    };

    return (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg shadow-indigo-500/5 border border-white/40 ring-1 ring-white/60 animate-in fade-in slide-in-from-bottom duration-500 relative overflow-hidden group hover:bg-white/80 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                    <ListChecks className="text-emerald-500" size={24} />
                    Mi Lista de Hoy
                </h2>
                {tasks.some(t => t.completed) && (
                    <button
                        onClick={clearCompleted}
                        className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Limpiar completados
                    </button>
                )}
            </div>

            <div className="flex gap-3 mb-6 items-stretch">
                <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="Nombre del prospecto..."
                    className="flex-1 bg-white border-2 border-slate-200 rounded-2xl px-5 py-4 text-base font-semibold focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-300 shadow-sm"
                />
                <button
                    onClick={addTask}
                    disabled={!newTaskName.trim()}
                    className="bg-emerald-600 text-white px-5 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md shadow-emerald-200/50 flex items-center justify-center group-hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={24} strokeWidth={3} />
                </button>
            </div>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-slate-500 font-medium italic">No hay seguimientos pendientes hoy.</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">¡Añade tu primer prospecto!</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${task.completed
                                ? 'bg-slate-50 border-slate-100 opacity-60'
                                : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-200 hover:border-emerald-400'
                                        }`}
                                >
                                    {task.completed && <Check size={14} strokeWidth={4} />}
                                </button>
                                <span className={`text-sm font-bold text-slate-700 truncate ${task.completed ? 'line-through' : ''}`}>
                                    {task.name}
                                </span>
                            </div>
                            <button
                                onClick={() => removeTask(task.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
