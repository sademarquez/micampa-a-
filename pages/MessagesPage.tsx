import React, { useEffect, useState, FormEvent } from 'react';
import { getMessages, sendMessage } from '../services/electoralPwaService';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, InboxIcon } from '@heroicons/react/24/outline';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState({ recipient: '', subject: '', body: '' });
  const [showCompose, setShowCompose] = useState(false);
  const [sending, setSending] = useState(false);


  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError("Error al cargar los mensajes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMessage(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("Usuario no autenticado.");
        return;
    }
    if (!newMessage.recipient.trim() || !newMessage.body.trim()) {
        setError("Destinatario y cuerpo del mensaje son obligatorios.");
        return;
    }
    setSending(true);
    setError(null);
    setSuccess(null);
    try {
        await sendMessage({
            ...newMessage,
            sender: user.userID, // ID del candidato/usuario
        });
        setSuccess("Mensaje enviado con éxito.");
        setNewMessage({ recipient: '', subject: '', body: '' }); // Reset form
        setShowCompose(false);
        fetchMessages(); // Refresh messages
    } catch (err) {
        setError("Error al enviar el mensaje.");
        console.error(err);
    } finally {
        setSending(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });

  if (loading && messages.length === 0) {
    return <LoadingSpinner message="Cargando mensajes..." />;
  }
  
  const tailwindInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3 text-teal-600" />
            Mensajería Interna
        </h1>
        <button
            onClick={() => setShowCompose(!showCompose)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
        >
            {showCompose ? 'Cancelar' : 'Redactar Mensaje'}
        </button>
      </div>

      {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}
      {success && <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />}

      {showCompose && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
              <h2 className="text-xl font-semibold mb-4">Nuevo Mensaje</h2>
              <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                      <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Destinatario (ID o Grupo)</label>
                      <input type="text" name="recipient" id="recipient" value={newMessage.recipient} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                  <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto (Opcional)</label>
                      <input type="text" name="subject" id="subject" value={newMessage.subject} onChange={handleInputChange} className={tailwindInputClass}/>
                  </div>
                  <div>
                      <label htmlFor="body" className="block text-sm font-medium text-gray-700">Cuerpo del Mensaje</label>
                      <textarea name="body" id="body" rows={4} value={newMessage.body} onChange={handleInputChange} className={tailwindInputClass} required/>
                  </div>
                  <div className="flex justify-end">
                      <button type="submit" disabled={sending} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                          {sending ? <LoadingSpinner size="sm"/> : <><PaperAirplaneIcon className="h-5 w-5 mr-2"/> Enviar</>}
                      </button>
                  </div>
              </form>
          </div>
      )}

      {loading && messages.length > 0 && <LoadingSpinner message="Actualizando..."/>}

      {messages.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {messages.map((msg) => (
                    <li key={msg.id} className={`p-4 hover:bg-gray-50 ${!msg.read && msg.recipient === user?.userID ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">
                                    De: <span className="font-medium text-gray-700">{msg.sender === user?.userID ? 'Yo' : msg.sender}</span>
                                    { msg.sender !== user?.userID && <> &bull; Para: <span className="font-medium text-gray-700">{msg.recipient === user?.userID ? 'Mí' : msg.recipient}</span></> }
                                </p>
                                <p className={`text-lg font-semibold ${!msg.read && msg.recipient === user?.userID ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {msg.subject || '(Sin Asunto)'}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(msg.timestamp)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{msg.body}</p>
                         {/* TODO: Implementar vista de mensaje completo al hacer clic */}
                    </li>
                ))}
            </ul>
        </div>
      ) : (
        !loading && 
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No hay mensajes en tu bandeja.</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;