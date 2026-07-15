import React, { useState } from 'react';
import { Send, Bot, User, Paperclip } from 'lucide-react';

export default function CustomerChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I am ResolveAI. How can I assist you with your order, billing, or technical issues today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulated Agent Orchestrator Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Processing message via ResolveAI LangGraph multi-agent routing...' }
      ]);
    }, 1000);
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
      </div>

      {/* Input Form Box Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center space-x-3">
        <button type="button" className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about refunds, track orders, or create support tickets..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-all"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}