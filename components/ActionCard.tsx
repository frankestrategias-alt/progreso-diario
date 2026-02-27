import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Pencil, Save } from 'lucide-react';
import { triggerHaptic } from '../utils/magic';

interface ActionCardProps {
  text: string;
  onCopy?: () => void;
  hideCopy?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({ text, onCopy, hideCopy = false }) => {
  const [currentText, setCurrentText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local state if the prop changes (e.g. new generation)
  useEffect(() => {
    setCurrentText(text);
    setIsEditing(false);
  }, [text]);

  // Auto-focus text area when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Adjust height automatically
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleCopy = () => {
    if (onCopy) onCopy();

    // Safety check for navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentText);
    } else {
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement("textarea");
      textArea.value = currentText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }

    setCopied(true);
    triggerHaptic('light');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Function to render text with Bold support (*text*)
  const renderFormattedText = (content: string) => {
    const parts = content.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <strong key={index} className="font-bold text-slate-900">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`
        bg-white p-4 rounded-xl shadow-sm border mb-4 relative group transition-all duration-300 transform
        ${isEditing ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200'}
        ${copied ? 'ring-2 ring-emerald-500/50 bg-emerald-50/30 scale-[1.02] shadow-md border-emerald-200' : ''}
    `}>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value);
            // Auto-grow height
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          className="w-full bg-transparent text-slate-800 text-base leading-relaxed resize-none focus:outline-none pr-8 font-sans"
          rows={3}
        />
      ) : (
        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed pr-16 min-h-[3rem]">
          {renderFormattedText(currentText.trim())}
        </div>
      )}

      {/* Copy Feedback Toast */}
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300 z-20">
          ¡Mensaje copiado!
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full pl-1">

        {isEditing ? (
          <button
            onClick={toggleEdit}
            className="p-2 rounded-full text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-sm"
            title="Guardar cambios"
          >
            <Save size={16} />
          </button>
        ) : (
          <>
            <button
              onClick={toggleEdit}
              className="p-2 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              title="Editar texto"
            >
              <Pencil size={16} />
            </button>
            {!hideCopy && (
              <button
                onClick={handleCopy}
                className={`p-2 rounded-full transition-all duration-300 ${copied
                  ? 'bg-emerald-500 text-white scale-110 rotate-12 shadow-lg shadow-emerald-200'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 animate-icon-pulse'
                  }`}
                title="Copiar texto"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};