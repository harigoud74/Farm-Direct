import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CornerDownLeft,
  User,
  Sprout
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  suggestions?: string[];
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const { t } = useLanguage();
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Namaste! I am the **FarmDirect AI Agro Assistant**. I am grounded in live AGMARKNET Mandi rates, regional micro-weather, and real buyer demands.\n\nHow can I help your farm or procurement today?`,
      source: 'FarmDirect Agricultural Intelligence Engine',
      suggestions: [
        'What should I sell today?',
        'How are tomato prices trending?',
        'What weather is expected tomorrow?',
        'Which buyers need bulk produce?'
      ],
      timestamp: 'Just now'
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await api.askAIChat(q, userRole);
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        source: res.source,
        suggestions: res.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I could not connect to the advisory service right now. Please try again shortly.',
          source: 'Fallback System',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">{t('aiAssistant')}</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {t('mandiIntelligence')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {t('mandiSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-emerald-800 text-white font-medium rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 border border-stone-200/80 rounded-tl-none'
                }`}
              >
                {msg.text}

                {msg.source && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-stone-500 flex items-center gap-1 font-sans">
                    <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>Data Grounding: <strong>{msg.source}</strong></span>
                  </div>
                )}
              </div>

              {/* Suggestions chips if any */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s)}
                      className="text-[11px] font-semibold bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-300 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
                    >
                      {s} &rarr;
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 border p-3 rounded-2xl max-w-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>{t('evaluatingQuality')}...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask: 'What should I sell today?', 'How are tomato prices trending?'..."
              className="flex-1 p-3 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40"
              aria-label="Send prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

