import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeSpecTab, setActiveSpecTab] = useState('structure');

  // Agent data taken directly from README workflow schema specifications
  const agentsList = [
    { name: 'FAQ Agent', task: 'Answers general policy and documentation questions via semantic vector search' },
    { name: 'Billing Agent', task: 'Handles structural refunds, system invoices, and tracking payment failures' },
    { name: 'Order Agent', task: 'Checks real-time customer shipment statuses via API execution tools' },
    { name: 'Ticket Agent', task: 'Auto-creates system tickets with priority classifications and category types' },
    { name: 'Sentiment Agent', task: 'Analyzes language indicators to instantly spot client frustration spikes' },
    { name: 'Escalation Agent', task: 'Summarizes interaction history and safely context-routes to human workflows' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[25%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Global Navbar */}
      <header className="border-b border-gray-900 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              🚀 Resolve-AI
            </span>
            <span className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">Enterprise Grade</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-400 font-medium">
            <a href="#features" className="hover:text-white transition">Core Features</a>
            <a href="#agents" className="hover:text-white transition">Multi-Agent Workflow</a>
            <a href="#architecture" className="hover:text-white transition">System Design</a>
            <a href="#endpoints" className="hover:text-white transition">API Gateways</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition px-2">Sign In</Link>
            <Link to="/register" className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/10 transform hover:-translate-y-0.5">
              Launch Console
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Block */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-400 mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          LangGraph Multi-Agent Orchestrator Platform
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Enterprise Customer Support Driven by{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Autonomous Graph Workflows
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Resolve-AI provides an automated support platform complete with semantic RAG over documentation, real-time sentiment analysis, intent routing loops, and smooth human agent escalations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xs sm:max-w-md mx-auto mb-20">
          <Link to="/register" className="w-full text-center font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-xl shadow-blue-900/20 hover:opacity-90 transition">
            Register Account
          </Link>
          <Link to="/login" className="w-full text-center font-semibold bg-gray-900 border border-gray-800 text-gray-200 px-6 py-3.5 rounded-xl hover:bg-gray-850 transition">
            Sign In Gateway
          </Link>
        </div>

        {/* Live LangGraph State Initialization Board */}
        <div className="max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-left font-mono text-xs text-gray-300 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-850 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
            </div>
            <span className="text-gray-500 text-[11px]">ai-agents/graph/workflow.py</span>
          </div>
          <div className="space-y-1.5 overflow-x-auto text-blue-300">
            <p className="text-gray-500"># Compiling Resolve-AI LangGraph Support State Machine...</p>
            <p>workflow = StateGraph(SupportState)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"sentiment"</span>, detect_sentiment)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"faq"</span>, answer_faq)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"order"</span>, check_order)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"billing"</span>, handle_billing)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"ticket"</span>, create_ticket)</p>
            <p>workflow.add_node(<span className="text-emerald-400">"escalate"</span>, escalate_to_human)</p>
            <p className="text-purple-400">workflow.set_entry_point("sentiment")</p>
            <p className="text-amber-400">workflow.add_conditional_edges("sentiment", route_query)</p>
            <p className="text-emerald-400">✓ Resolve-AI LangGraph compiled successfully. Gateway listening on port 8001.</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-900">
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tight mb-4">Core Operational Capabilities</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Explore how Resolve-AI integrates semantic layers, persistence mechanisms, and visual management control hubs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-white mb-2">🤖 AI Conversational Interface</div>
            <p className="text-gray-400 text-xs leading-relaxed">Accepts natural text prompts, utilizing context boundaries alongside a custom file upload interface for order receipts or screenshot ingestion matrices.</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-emerald-400 mb-2">📚 Grounded RAG Ingestion</div>
            <p className="text-gray-400 text-xs leading-relaxed">Converts structural company PDFs, policies, and manuals into vector coordinates inside the Qdrant database to secure reliable output generation.</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-indigo-400 mb-2">💾 Continuous Conversation Memory</div>
            <p className="text-gray-400 text-xs leading-relaxed">Saves historical contextual state mappings natively within MongoDB schemas, ensuring long-term reference retention inside active chat sessions.</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-amber-400 mb-2">🎟️ Automated Ticket Pipelines</div>
            <p className="text-gray-400 text-xs leading-relaxed">Instantly instantiates backend ticket registries containing auto-assigned priority scales, problem classifications, and technical summaries when bots encounter roadblocks.</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-purple-400 mb-2">📈 Live Support Dashboards</div>
            <p className="text-gray-400 text-xs leading-relaxed">Gives support managers clear analytical tools tracking resolution parameters, satisfaction scores, and query volume indexes.</p>
          </div>
          <div className="p-6 bg-gray-900/30 border border-gray-900 rounded-xl">
            <div className="text-xl font-bold text-red-400 mb-2">🛠️ Knowledge Command Center</div>
            <p className="text-gray-400 text-xs leading-relaxed">Enables platform administrators to easily modify agent operational profiles, review process decision tracks, and ingest new documentation chunks.</p>
          </div>
        </div>
      </section>

      {/* Multi-Agent Graph Allocation Section */}
      <section id="agents" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-900 bg-gray-900/10">
        <div className="text-center mb-16">
          <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase">LangGraph Architecture Map</span>
          <h2 className="text-3xl md:text-5xl font-black mt-2 tracking-tight">Granular Multi-Agent Node Array</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentsList.map((agent, index) => (
            <div key={index} className="p-6 bg-gray-900/50 border border-gray-850 rounded-xl relative overflow-hidden group hover:border-indigo-500/50 transition">
              <div className="text-xs font-mono text-gray-500 mb-2">node_id: 0{index + 1}</div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition">{agent.name}</h4>
              <p className="text-gray-400 text-xs leading-relaxed">{agent.task}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Specifications and Workspace Structures Section */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-900">
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tight mb-4">Technical System Specifications</h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Review structural project path mapping layouts and documentation rules.</p>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveSpecTab('structure')} className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border transition ${activeSpecTab === 'structure' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>Directory Map</button>
          <button onClick={() => setActiveSpecTab('stack')} className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border transition ${activeSpecTab === 'stack' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>Core Stack</button>
        </div>

        <div className="bg-gray-900/20 border border-gray-850 p-6 rounded-xl max-w-3xl mx-auto font-mono text-xs text-gray-300">
          {activeSpecTab === 'structure' && (
            <div className="overflow-x-auto max-h-[350px]">
              <p className="text-gray-500">// Resolve-AI Project File Architecture Map</p>
              <p>resolveai/</p>
              <p>├── frontend/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; # React + Tailwind + Shadcn UI</p>
              <p>│ &nbsp; ├── src/components/ &nbsp; &nbsp;# Chat, Dashboard, Admin views</p>
              <p>│ &nbsp; └── src/pages/ &nbsp; &nbsp; &nbsp; &nbsp; # Route views [CustomerChat, SupportDashboard]</p>
              <p>├── backend/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# Node.js + Express (API Gateway & Auth)</p>
              <p>│ &nbsp; ├── src/models/ &nbsp; &nbsp; &nbsp; &nbsp; # User (Sequelize) & Ticket/Chat (Mongoose)</p>
              <p>│ &nbsp; └── src/middleware/ &nbsp; &nbsp;# authMiddleware.js & Multer engine</p>
              <p>└── ai-agents/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# LangGraph Agent Logic (Python FastAPI)</p>
            </div>
          )}

          {activeSpecTab === 'stack' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
                <span className="text-blue-400 font-bold block mb-1">UI & Gateway Tier</span>
                <p className="text-gray-400 text-[11px]">React 18, Tailwind CSS, Axios, Express API Gateway, JSON Web Tokens, Bcryptjs.</p>
              </div>
              <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
                <span className="text-emerald-400 font-bold block mb-1">Orchestration & Vectors</span>
                <p className="text-gray-400 text-[11px]">Python FastAPI, LangGraph Core State Engine, LangChain Framework, Qdrant DB.</p>
              </div>
              <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
                <span className="text-indigo-400 font-bold block mb-1">Dual Persistence Data Model</span>
                <p className="text-gray-400 text-[11px]">PostgreSQL (tickets via Sequelize engine) paired alongside MongoDB (chat log storage).</p>
              </div>
              <div className="p-4 bg-gray-950 rounded-lg border border-gray-850">
                <span className="text-purple-400 font-bold block mb-1">Core AI Models</span>
                <p className="text-gray-400 text-[11px]">OpenAI GPT-4o systems alongside ultra-low latency Groq Llama 3 computing pipelines.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* API Documentation Routing Matrix Section */}
      <section id="endpoints" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tight">API Gateway Routing Definitions</h2>
          <p className="text-gray-400 text-xs mt-2">Express endpoints routing incoming traffic out to active components.</p>
        </div>
        <div className="max-w-4xl mx-auto bg-gray-900/30 border border-gray-900 rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-3 bg-gray-950 p-4 font-bold border-b border-gray-850 text-xs uppercase tracking-wider text-gray-400">
            <div>Method</div>
            <div>Endpoint Router Path</div>
            <div>Description Target</div>
          </div>
          <div className="divide-y divide-gray-850 text-xs font-mono">
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-emerald-400 font-bold">POST</div>
              <div className="text-gray-300">/api/auth/login</div>
              <div className="text-gray-400">Issues JWT access tokens upon validation</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-emerald-400 font-bold">POST</div>
              <div className="text-gray-300">/api/auth/register</div>
              <div className="text-gray-400">Registers user data into system schemas</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-emerald-400 font-bold">POST</div>
              <div className="text-gray-300">/api/chat/message</div>
              <div className="text-gray-400">Forwards conversation events to FastAPI agents</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-blue-400 font-bold">GET</div>
              <div className="text-gray-300">/api/tickets</div>
              <div className="text-gray-400">Fetches list of internal system logs</div>
            </div>
            <div className="grid grid-cols-3 p-4 items-center">
              <div className="text-emerald-400 font-bold">POST</div>
              <div className="text-gray-300">/api/knowledge/upload</div>
              <div className="text-gray-400">Processes document vector ingestion via Multer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer Layout */}
      <footer className="border-t border-gray-900 py-12 bg-gray-950 text-center text-xs text-gray-600 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Resolve-AI Systems. Architecture built via MIT Specifications.</p>
          <div className="flex gap-4 text-gray-500">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#agents" className="hover:text-white transition">Nodes</a>
            <a href="#architecture" className="hover:text-white transition">Specs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;