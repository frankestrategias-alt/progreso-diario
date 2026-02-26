import React, { useState, useEffect, useRef } from 'react';
import { Bot, Crown, Send, X, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { generateEliteAssistantResponse, speak } from '../services/geminiService';

const EliteChatBubble: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { role: 'ai', content: '¡Hola! Soy tu Asistente Elite. ¿En qué puedo ayudarte a potenciar tu negocio hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            // El cerebro: Enviamos a Gemini usando la funcion de Elite Assistant y pasamos el historial
            const response = await generateEliteAssistantResponse(userMsg, messages);
            setIsTyping(false);

            setMessages(prev => [...prev, { role: 'ai', content: response }]);

            // La Voz: Google Cloud TTS
            setIsSpeaking(true);
            await speak(response);
            setIsSpeaking(false);

        } catch (error) {
            console.error("Chat Error:", error);
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[10000] font-inter">
            {/* Trigger Bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full bg-black border-2 border-[#c5a059] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'rotate-90' : ''}`}
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(197,160,89,0.3)' }}
            >
                {isOpen ? <X className="text-[#c5a059]" /> : <Bot className="text-[#c5a059]" size={28} />}
                {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-50"></div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-[#0a0a0c]/95 backdrop-blur-xl border-2 border-[#c5a059] rounded-[32px] flex flex-col overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-10 duration-300 transform origin-bottom-right max-w-[calc(100vw-3rem)]">
                    <div className="flex flex-col h-full w-full">
                        {/* Header */}
                        <div className="p-4 border-b border-[#c5a059]/20 bg-gradient-to-br from-[#c5a059]/10 to-transparent flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-[#c5a059] bg-black flex items-center justify-center">
                                    <Sparkles size={20} className="text-[#c5a059]" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-white font-outfit text-base font-bold flex items-center gap-1.5">
                                        Asistente <Bot size={14} className="text-[#c5a059]" />
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-green-500 text-[9px] font-black uppercase tracking-wider">En Línea</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="https://sistemapremium.netlify.app/?utm_source=networkerpro&utm_medium=agent"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all outline-none"
                            >
                                <Crown size={12} />
                                <span>PREMIUM</span>
                            </a>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-none">
                            {messages.map((msg, i) => (
                                <div key={i} className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai'
                                    ? 'bg-white/5 text-slate-100 self-start rounded-bl-sm border border-white/10'
                                    : 'bg-gradient-to-br from-[#c5a059] to-[#a68245] text-black font-semibold self-end rounded-br-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="bg-white/5 p-4 rounded-2xl self-start flex gap-1 animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer Input */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white/5 border border-[#c5a059]/30 rounded-full px-4 py-1 flex items-center focus-within:border-[#c5a059] transition-colors">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Escribe tu consulta..."
                                        className="bg-transparent border-none text-white text-sm w-full py-2 outline-none placeholder:text-slate-600"
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    className="w-11 h-11 rounded-full bg-[#c5a059] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EliteChatBubble;
