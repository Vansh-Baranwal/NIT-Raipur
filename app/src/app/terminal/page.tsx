'use client';

import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings, Maximize2, X, Minus, Bell, Activity, Search } from 'lucide-react';

export default function TerminalWindow() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [health, setHealth] = useState('LIVE');
  const [latency, setLatency] = useState(15);
  
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/health');
        const data = await res.json();
        setHealth(data.mode.toUpperCase());
        setLatency(data.services[0].latencyMs);
      } catch (e) {
        setHealth('OFFLINE');
      }
    };
    fetchHealth();
    const int = setInterval(fetchHealth, 5000);
    return () => clearInterval(int);
  }, []);

  const handleMinimize = () => window.terminalApi?.minimize();
  const handleMaximize = () => window.terminalApi?.maximize();
  const handleClose = () => window.terminalApi?.close();

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-300 font-mono text-sm overflow-hidden selection:bg-teal-500/30">
      {/* Title Bar - Draggable */}
      <div 
        className="flex items-center justify-between px-3 h-8 bg-zinc-900 border-b border-zinc-800"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold text-amber-500">UTSAVA</span>
          <span className="text-xs text-zinc-500">v1.0</span>
          
          <div className="flex items-center gap-2 text-xs ml-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              health === 'LIVE' ? 'bg-teal-500/20 text-teal-400' :
              health === 'DEGRADED' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {health}
            </div>
            <div className="text-zinc-500">{latency}ms</div>
          </div>
        </div>

        <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {['Overview', 'Copilot', 'Risk', 'Alerts', 'Audit'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-sm ${activeTab === tab ? 'bg-zinc-700 text-white' : 'hover:bg-zinc-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="relative flex items-center px-2 py-1 bg-zinc-800 rounded">
            <Search size={14} className="text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="/ command..." 
              className="bg-transparent border-none outline-none text-xs w-32"
            />
          </div>
          
          <button className="p-1 hover:bg-zinc-800 rounded"><Bell size={14} /></button>
          <button className="p-1 hover:bg-zinc-800 rounded"><Settings size={14} /></button>
          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
          <button onClick={handleMinimize} className="p-1 hover:bg-zinc-800 rounded"><Minus size={14} /></button>
          <button onClick={handleMaximize} className="p-1 hover:bg-zinc-800 rounded"><Maximize2 size={14} /></button>
          <button onClick={handleClose} className="p-1 hover:bg-red-500 hover:text-white rounded"><X size={14} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-1 overflow-hidden">
        {activeTab === 'Overview' && <OverviewWorkspace />}
        {activeTab === 'Copilot' && <CopilotWorkspace />}
        {activeTab === 'Risk' && <RiskWorkspace />}
        {activeTab === 'Alerts' && <AlertsWorkspace />}
        {activeTab === 'Audit' && <AuditWorkspace />}
      </div>
    </div>
  );
}

// Mock Workspaces for now
function OverviewWorkspace() {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      <Panel defaultSize={30} minSize={20}>
        <div className="h-full bg-zinc-900 border border-zinc-800 m-0.5 rounded flex flex-col">
          <div className="px-2 py-1 bg-zinc-800 text-xs font-bold border-b border-zinc-700">PORTFOLIO</div>
          <div className="p-2 overflow-auto text-xs">
            <table className="w-full text-left">
              <thead><tr><th>TICKER</th><th>QTY</th><th>PRICE</th><th>CHG</th></tr></thead>
              <tbody>
                <tr><td>RELIANCE</td><td>500</td><td>2800.00</td><td className="text-teal-400">+1.2%</td></tr>
                <tr><td>TCS</td><td>300</td><td>3800.00</td><td className="text-red-400">-0.5%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-amber-500 transition-colors" />
      <Panel defaultSize={70}>
        <PanelGroup direction="vertical">
          <Panel defaultSize={60}>
            <div className="h-full bg-zinc-900 border border-zinc-800 m-0.5 rounded flex flex-col">
              <div className="px-2 py-1 bg-zinc-800 text-xs font-bold border-b border-zinc-700">PRICE & WEATHER CHARTS</div>
              <div className="flex-1 p-2 flex items-center justify-center text-zinc-600">[Chart Canvas]</div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1 bg-zinc-800 hover:bg-amber-500 transition-colors" />
          <Panel defaultSize={40}>
            <div className="h-full bg-zinc-900 border border-zinc-800 m-0.5 rounded flex flex-col">
              <div className="px-2 py-1 bg-zinc-800 text-xs font-bold border-b border-zinc-700">SENTIMENT FEED</div>
              <div className="flex-1 p-2 overflow-auto text-xs">
                 <div className="mb-2"><span className="text-amber-400">[08:30]</span> <span className="bg-red-500/20 text-red-400 px-1 rounded mr-1">NEG</span> TCS Q3 guidance falls short of estimates.</div>
                 <div className="mb-2"><span className="text-amber-400">[08:15]</span> <span className="bg-teal-500/20 text-teal-400 px-1 rounded mr-1">POS</span> Reliance unveils new renewable energy plan.</div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}

function CopilotWorkspace() {
  return (
    <div className="h-full bg-zinc-900 border border-zinc-800 m-0.5 rounded flex flex-col">
       <div className="px-2 py-1 bg-zinc-800 text-xs font-bold border-b border-zinc-700">AGENTIC COPILOT</div>
       <div className="flex-1 flex items-center justify-center text-zinc-600">[Agent Graph & Answer Stream]</div>
       <div className="p-2 border-t border-zinc-800">
         <input type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-sm outline-none focus:border-amber-500" placeholder="Ask about portfolio risk, weather impact on holdings..." />
       </div>
    </div>
  );
}

function RiskWorkspace() { return <div className="p-4">Risk Panel placeholder</div>; }
function AlertsWorkspace() { return <div className="p-4">Alerts Panel placeholder</div>; }
function AuditWorkspace() { return <div className="p-4">Audit Panel placeholder</div>; }
