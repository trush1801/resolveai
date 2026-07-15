import React from 'react';
import { BarChart3, Ticket, Activity, CheckCircle2 } from 'lucide-react';

export default function SupportDashboard() {
  const stats = [
    { title: 'Total Tickets Open', value: '142', change: '+12% from yesterday', icon: <Ticket className="text-indigo-400" /> },
    { title: 'AI Resolution Rate', value: '84.3%', change: 'Optimized via RAG vectors', icon: <CheckCircle2 className="text-emerald-400" /> },
    { title: 'Avg Response Time', value: '1.4s', change: 'Groq/Llama-3 processing acceleration', icon: <Activity className="text-amber-400" /> },
    { title: 'Human Escalations', value: '12', change: 'Awaiting manual context routing', icon: <BarChart3 className="text-rose-400" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Core Analytics Console</h2>
        <p className="text-sm text-slate-400 mt-1">Real-time supervision of active ResolveAI downstream agents.</p>
      </div>

      {/* Analytics Card Row grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between shadow-md">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.title}</span>
              <div className="text-3xl font-bold text-slate-100">{stat.value}</div>
              <p className="text-xs text-slate-500 font-medium">{stat.change}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Graph Area Pipeline Placeholder */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl h-64 flex flex-col items-center justify-center text-center">
        <BarChart3 className="text-slate-600 mb-3 animate-pulse" size={40} />
        <h3 className="text-sm font-semibold text-slate-300">Telemetry Log Visualization Graph</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">Recharts configuration data streams will pipe here following API gateway implementation.</p>
      </div>
    </div>
  );
}