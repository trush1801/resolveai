import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am ResolveAI. How can I assist you with your order, billing, or technical issues today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Log component mounts/updates for lifecycle tracking
  useEffect(() => {
    console.log("🖥️ Chat Window Component Mounted. Session ID Status:", sessionId);
  }, [sessionId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    console.log("📩 Form submit intercepted! Input value:", `"${input}"`);
    
    if (!input.trim()) {
      console.warn("🛑 Prevented submission: Input string is empty.");
      return;
    }
    
    if (loading) {
      console.warn("🛑 Prevented submission: Network is already pending (loading === true).");
      return;
    }

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // 1. Optimistically push user message to local UI state
    const temporaryUserMsg = { role: 'user', content: userText, timestamp: new Date() };
    setMessages((prev) => [...prev, temporaryUserMsg]);

    try {
      // Fetching authentication token with fallback monitoring
      const token = localStorage.getItem('resolveai_token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

      console.log("🔑 Authentication verification:");
      console.log(`   - Token key [resolveai_token]:`, token ? `Found (${token.substring(0, 15)}...)` : "⚠️ MISSING/NULL");
      console.log(`   - Target Endpoint: ${backendUrl}/api/chat/message`);

      // 2. Dispatching Network Request
      console.log("🚀 Launching Axios POST request...");
      const response = await axios.post(
        `${backendUrl}/api/chat/message`,
        { message: userText, sessionId: sessionId },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      console.log("📥 Axios Response received successfully:", response.data);

      if (response.data.status === 'success') {
        setMessages(response.data.history);
        if (response.data.sessionId) {
          setSessionId(response.data.sessionId);
        }
      } else {
        console.warn("⚠️ Gateway responded, but status was not 'success':", response.data);
      }

    } catch (error) {
      console.error("💥 UI Chat Pipeline Exception:", error);
      
      // Provide explicit debug error feedback in UI
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: `❌ Connection Error: ${error.message || 'Failed to reach central server gateway.'}` 
        }
      ]);
    } finally {
      // Ensure the UI unlocks under all conditions
      setLoading(false);
      console.log("🔄 Operation complete. Loading lock released.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#070d19] text-slate-100 font-sans antialiased">
      {/* Top Banner Control Framework */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0b132b]/60 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          <h1 className="text-sm font-semibold tracking-wide text-slate-200">ResolveAI Core Router</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-medium text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
            Session Active
          </span>
          <button 
            onClick={() => navigate('/')} 
            className="px-3 py-1 text-xs font-medium border border-slate-800 rounded-md hover:bg-slate-900 hover:text-white transition duration-200"
          >
            ← Leave Console
          </button>
        </div>
      </header>

      {/* Main Message Stream Workspace */}
      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6 max-w-5xl w-full mx-auto scrollbar-thin scrollbar-thumb-slate-900">
        {messages.map((msg, index) => (
          <div 
            key={msg._id || index} 
            className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end space-x-reverse' : 'justify-start'}`}
          >
            {/* Conditional Avatar Display Modules */}
            {msg.role === 'user' ? (
              <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            )}

            {/* Message Chat Bubble */}
            <div className={`max-w-[70%] rounded-xl px-4 py-3 shadow-md border text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-950/40 border-indigo-500/20 text-slate-200 rounded-tr-none' 
                : 'bg-[#0f172a]/80 border-slate-800/60 text-slate-300 rounded-tl-none'
            }`}>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        
        {/* Loading / Status State Module Container */}
        {loading && (
          <div className="flex items-start space-x-3 justify-start">
            <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
              </svg>
            </div>
            <div className="bg-[#0f172a]/80 border border-slate-800/60 text-slate-400 rounded-xl rounded-tl-none px-4 py-3 text-sm flex items-center space-x-2">
              <span className="text-xs font-medium tracking-wide animate-pulse">
                Processing message via ResolveAI LangGraph multi-agent routing...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Docked Control Input Base Dock */}
      <footer className="p-6 bg-[#070d19] border-t border-slate-900">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-center space-x-4 bg-[#0b132b]/40 border border-slate-800/80 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/60 transition duration-200">
          
          {/* File Attachment Utility Stub */}
          <button type="button" className="text-slate-500 hover:text-slate-300 transition duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about refunds, track orders, or create support tickets..."
            className="flex-1 bg-transparent border-none text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/60 disabled:text-slate-600 text-white p-2 rounded-lg transition duration-200 shadow-md shadow-indigo-950/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;