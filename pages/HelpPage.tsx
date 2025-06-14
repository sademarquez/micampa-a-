
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { handleChatbot } from '../services/campaignService'; // campaignService ahora tiene la llamada a Gemini
import { PaperAirplaneIcon, ChatBubbleLeftEllipsisIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext'; // Para obtener info del candidato si es necesario

const HelpPage: React.FC = () => {
  const { user } = useAuth(); // Podrías pasar user.nombreCompleto o un ID de campaña al chatbot
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'initial', text: '¡Hola! Soy el asistente virtual de Mi Campaña. ¿Cómo puedo ayudarte hoy?', sender: 'bot', timestamp: Date.now() }
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
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Aquí podrías construir un objeto de contexto del candidato si es necesario
      const candidateContext = {
        candidateName: user?.nombreCompleto || "la candidata actual",
        // Otros datos relevantes de `user` o de la campaña
      };
      const botResponseText = await handleChatbot(currentInput, candidateContext);
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
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg flex flex-col" style={{height: 'calc(100vh - 10rem)'}}> {/* Ajusta altura según necesidad */}
      <header className="bg-sky-600 text-white p-4 rounded-t-lg"> {/* Color actualizado */}
        <h2 className="text-xl font-semibold flex items-center">
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2" />
          Asistente Virtual de Campaña
        </h2>
      </header>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none' // Colores actualizados
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p> {/* whitespace-pre-wrap para saltos de línea */}
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
              <span className="text-sm italic">Asistente está pensando...</span>
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
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-sky-500 focus:border-sky-500 outline-none" // Color de focus actualizado
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white p-2 rounded-r-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 disabled:bg-sky-300" // Color actualizado
          >
            <PaperAirplaneIcon className="h-6 w-6 transform rotate-45" />
            <span className="sr-only">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default HelpPage;
