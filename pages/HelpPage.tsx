import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { handleChatbot } from '../services/campaignService';
import { PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon, SparklesIcon } from '@heroicons/react/24/outline';

const HelpPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', text: '¡Hola! Soy el asistente virtual de Mi Campaña. ¿Cómo puedo ayudarte hoy? Puedes preguntar sobre cómo registrarte, las propuestas, o cómo colaborar.', sender: 'bot', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, text: input, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const botResponseText = await handleChatbot(input);
      const botMessage: ChatMessage = { id: `bot-${Date.now()}`, text: botResponseText, sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error en chatbot:", error);
      const errorMessage: ChatMessage = { id: `error-${Date.now()}`, text: 'Lo siento, hubo un problema al procesar tu solicitud. Intenta más tarde.', sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg flex flex-col" style={{height: 'calc(100vh - 10rem)'}}>
      <header className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold flex items-center">
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2" />
          Canal de Ayuda / Asistente Virtual
        </h2>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs mt-1 opacity-75 text-right">
                {new Date(msg.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow bg-gray-200 text-gray-800">
              <SparklesIcon className="h-5 w-5 animate-pulse inline-block mr-1" />
              <span className="text-sm italic">Asistente está escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-indigo-300"
          >
            <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
            <span className="sr-only">Enviar</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Para preguntas complejas, o si el asistente no puede ayudarte, por favor contacta a un miembro del equipo de campaña.
        </p>
      </form>
    </div>
  );
};

export default HelpPage;