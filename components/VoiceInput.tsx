import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    placeholder?: string;
    className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, placeholder = "Dictar...", className = "" }) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'es-ES';

            recognitionInstance.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };

            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setError('speech-not-supported');
        }
    }, [onTranscript]);

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
        } else {
            setError(null);
            try {
                recognition?.start();
                setIsListening(true);
            } catch (e) {
                console.error('Failed to start recognition', e);
            }
        }
    };

    if (error === 'speech-not-supported') {
        return null; // Don't show the button if not supported
    }

    return (
        <button
            onClick={toggleListening}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                } ${className}`}
            title={isListening ? "Escuchando..." : "Dictar con voz"}
        >
            {isListening ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <Mic size={20} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
                {isListening ? "Escuchando..." : "Voz"}
            </span>
        </button>
    );
};
