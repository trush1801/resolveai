import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Send, Bot, User, Paperclip } from 'lucide-react';

export default function CustomerChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am ResolveAI. How can I assist you with your order, billing, or technical issues today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Ref handler for anchoring the hidden input file stream

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const normalizeHistory = (history = []) => (
    history.map((message, index) => ({
      id: message._id || `${message.role}-${message.timestamp || index}`,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp
    }))
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString()
    };

    setLoading(true);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('resolveai_token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

      const response = await axios.post(
        `${backendUrl}/api/chat/message`,
        {
          message: userText,
          sessionId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setMessages(normalizeHistory(response.data.history));
        setSessionId(response.data.sessionId);
        return;
      }

      throw new Error(response.data.error || 'ResolveAI returned an unexpected response.');
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Connection error: ${errorMessage}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: INGESTION PIPELINE INTEGRATION HANDLER ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF documents are supported.');
      return;
    }

    setLoading(true);

    // Optimistically push upload confirmation message into chat window thread
    setMessages((prev) => [
      ...prev,
      {
        id: `upload-${Date.now()}`,
        role: 'user',
        content: `📎 Uploading document: ${file.name}`
      }
    ]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('resolveai_token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

      console.log(`🚀 Dispatching multipart payload to ${backendUrl}/api/documents/upload-pdf`);
      
      const response = await axios.post(
        `${backendUrl}/api/documents/upload-pdf`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setMessages((prev) => [
          ...prev,
          {
            id: `upload-success-${Date.now()}`,
            role: 'assistant',
            content: `✅ Ingestion Complete! ${response.data.message} (${response.data.chunks_embedded} chunks embedded structurally into Qdrant). You can now ask questions about this document.`
          }
        ]);
      }
    } catch (error) {
      console.error("💥 Document Ingestion Core Failure:", error);
      const serverMessage = error.response?.data?.message || 'Could not communicate file payload to backend gateway.';
      setMessages((prev) => [
        ...prev,
        {
          id: `upload-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ Upload Failed: ${serverMessage}`
        }
      ]);
    } finally {
      setLoading(false);
      // Flush input cache clean to reset file handler targets
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Target Agent Node Context Indicator */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-sm tracking-wide text-slate-200">ResolveAI Core Router</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">Session Active</span>
      </div>

      {/* Message Streaming Thread Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600/10 text-indigo-200 border border-indigo-500/30' : 'bg-slate-800/40 text-slate-300 border border-slate-800'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700">
                <Bot size={18} />
              </div>
              <div className="p-3.5 rounded-xl text-sm leading-relaxed bg-slate-800/40 text-slate-400 border border-slate-800">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Box Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center space-x-3">
        {/* Paperclip trigger element linked via hidden input click interception */}
        <button 
          type="button" 
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-all"
        >
          <Paperclip size={20} />
        </button>
        
        {/* Hidden HTML File Input Module */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf"
          className="hidden"
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about refunds, track orders, or create support tickets..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white p-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}