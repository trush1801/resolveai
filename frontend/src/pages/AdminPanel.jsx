import React, { useState } from 'react';
import { Upload, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminPanel() {
  const [threshold, setThreshold] = useState(70);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">System Admin Control Center</h2>
        <p className="text-sm text-slate-400 mt-1">Configure vector database indexing configurations and orchestration parameters.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Knowledge Upload Card */}
        <div className="md:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center space-x-3 text-slate-200 font-medium border-b border-slate-800 pb-3">
            <Database size={18} className="text-indigo-400" />
            <span>Ingest Knowledge Base Resources</span>
          </div>
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer transition-all">
            <Upload className="text-slate-500 group-hover:text-indigo-400 mb-3 transition-colors" size={32} />
            <span className="text-sm font-medium text-slate-300">Drop platform documentation here</span>
            <span className="text-xs text-slate-500 mt-1">Supports PDF, TXT up to 10MB per unit block</span>
          </div>
        </div>

        {/* System Threshold Form Configuration */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6 shadow-md">
          <div className="flex items-center space-x-3 text-slate-200 font-medium border-b border-slate-800 pb-3">
            <ShieldAlert size={18} className="text-rose-400" />
            <span>Escalation Controls</span>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Confidence Cutoff Threshold</span>
              <span className="text-indigo-400 font-bold">{threshold}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full accent-indigo-600 bg-slate-950 h-2 rounded-lg cursor-pointer border border-slate-800"
            />
            <p className="text-[11px] text-slate-500 leading-normal mt-2">
              If the LangGraph state orchestration framework confidence registers below this point, context flags route directly to a human agent console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}