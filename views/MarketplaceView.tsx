import React from 'react';
import { Layout } from '../components/Layout';
import { ViewState } from '../types';
import { ShoppingBag, ExternalLink, Zap, Star, Shield, Gift, ArrowRight } from 'lucide-react';

interface MarketplaceViewProps {
    setViewState: (view: ViewState) => void;
}

const TOOLS = [
    {
        id: '1',
        name: 'Maestría en Network Marketing',
        description: 'Domina los secretos de la prospección masiva y la duplicación que usan los Top Earners en el mundo.',
        category: 'Máximo de Crecimiento',
        price: 'Ver Oferta',
        rating: 4.8,
        url: 'https://go.hotmart.com/H103007539B',
        image: '/maestria-network-marketing.png'
    },
    {
        id: '4',
        name: 'Systeme.io Elite',
        description: 'La plataforma todo-en-uno más potente para crear tus embudos de prospección, automatizar tu seguimiento y escalar tu equipo sin límites técnicos.',
        category: 'Marketing Todo-en-Uno',
        price: 'Ver Plataforma',
        rating: 4.9,
        url: 'https://systeme.io/es?sa=sa0212755329364d4560fb0979d7196b1cfc34b9a5',
        image: '/systeme-io-final.png.png.png'
    },
    {
        id: '5',
        name: 'Espacio Disponible',
        description: '¿Quieres expandir tu alcance? Posiciona tu negocio, servicio o sistema ante nuestra comunidad de líderes y emprendedores listos para la acción.',
        category: 'Alianza Pro',
        price: 'Postular Ahora',
        rating: 0,
        url: 'https://wa.me/573134140978?text=' + encodeURIComponent('Hola Frank, me interesa el Espacio Disponible para publicitar mi negocio en el Marketplace 🚀'),
        image: '/espacio-disponible-final.png.png'
    },
    {
        id: '6',
        name: 'Espacio Disponible',
        description: '¿Quieres expandir tu alcance? Posiciona tu negocio, servicio o sistema ante nuestra comunidad de líderes y emprendedores listos para la acción.',
        category: 'Alianza Pro',
        price: 'Postular Ahora',
        rating: 0,
        url: 'https://wa.me/573134140978?text=' + encodeURIComponent('Hola Frank, me interesa el Espacio Disponible para publicitar mi negocio en el Marketplace 🚀'),
        image: '/espacio-disponible-final.png.png'
    }
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ setViewState }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl shadow-xl mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Marketplace</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Herramientas de Afiliados</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-white rounded-[32px] border border-indigo-300/60 p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.15)] transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Accent line for featured items with images */}
                        {tool.image && (
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-violet-600 opacity-80" />
                        )}
                        <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {tool.category}
                                    </span>
                                    {tool.rating > 0 && (
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star size={10} fill="currentColor" />
                                            <span className="text-[10px] font-black">{tool.rating}</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">{tool.name}</h3>

                                {tool.image ? (
                                    <div className="my-4 rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 relative group/img">
                                        <img
                                            src={tool.image}
                                            alt={tool.name}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                // If image fails to load, we can hide it or show a placeholder
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).parentElement!.classList.add('hidden');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="my-4 aspect-video rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-dashed border-indigo-200 flex flex-col items-center justify-center gap-2 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 transition-all duration-500">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100 text-indigo-500 group-hover:scale-110 transition-transform">
                                            <Zap size={24} fill="currentColor" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Espacio Reservado</p>
                                    </div>
                                )}

                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
                                    {tool.description}
                                </p>

                                <div className="flex items-center justify-end">
                                    <a
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:from-indigo-500 hover:to-violet-600 transition-all shadow-md shadow-indigo-200/50 active:scale-95"
                                    >
                                        {tool.price} <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-950 rounded-[32px] p-8 text-center text-white relative overflow-hidden shadow-2xl mt-12 border border-indigo-500/20 group/support">
                {/* Decorative Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] -ml-24 -mb-24"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-6 group-hover/support:scale-110 transition-transform duration-500">
                        <Zap size={28} fill="currentColor" />
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">
                        ¿Tienes una <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">herramienta?</span>
                    </h3>

                    <p className="text-slate-200 text-sm mb-8 font-medium leading-relaxed max-w-[280px] mx-auto">
                        Únete a nuestro <span className="text-indigo-200 font-bold">Marketplace</span> y llega a miles de networkers profesionales.
                    </p>

                    <a
                        href={'https://wa.me/573134140978?text=' + encodeURIComponent('Hola Frank, me interesa integrar mi herramienta en el Marketplace de Networker Pro 🚀')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-700 text-white w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/support:animate-[shimmer_2s_infinite]"></div>

                        Contactar Soporte <ArrowRight size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};
