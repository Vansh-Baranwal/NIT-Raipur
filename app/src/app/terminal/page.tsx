'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings, Maximize2, X, Minus, Bell, Activity, Search, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, Play } from 'lucide-react';
import { createChart } from 'lightweight-charts';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import BrailleTerrainBackground from '@/components/BrailleTerrainBackground';
export default function TerminalWindow() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [health, setHealth] = useState('LIVE');
  const [latency, setLatency] = useState(15);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  const handleMinimize = () => window.terminalApi?.minimize();
  const handleMaximize = () => window.terminalApi?.maximize();
  const handleClose = () => window.terminalApi?.close();

  return (
    <BrailleTerrainBackground 
      background="#050505" 
      color="#c3cad4"
      className="h-screen w-screen overflow-hidden text-zinc-300 selection:bg-indigo-500/30"
    >
      <div className="flex flex-col h-full w-full font-sans text-sm">
        {/* Title Bar - Draggable */}
        <div 
          className="flex items-center justify-between px-4 pt-4 pb-2 bg-transparent z-50 shrink-0"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
        <div className="flex items-center gap-4 w-1/3">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
             <span className="font-bold text-white text-base tracking-wide">Sigma</span>
          </div>
        </div>

        {/* Floating Pill Navbar */}
        <div className="flex items-center justify-center w-1/3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="flex items-center gap-1 bg-black/90 backdrop-blur-2xl border border-[#1f2a36] rounded-full p-1.5 shadow-2xl relative">
            {/* MOCK TAG */}
            <div className="absolute -top-3 -right-3 bg-[#ffb000] text-[#121821] text-[9px] font-bold px-1.5 py-0.5 uppercase z-10 rounded-sm font-mono">MOCK</div>
            {['Overview', 'Scenarios', 'Monitor'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 text-[15px] font-medium rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-white/10 text-[#e6edf3]' : 'text-[#7a8a9c] hover:text-white hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
            
            <button 
              onClick={() => setActiveTab('Copilot')}
              className="relative inline-flex items-center justify-center rounded-full p-[1px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-500 ml-1 transition-transform hover:scale-105"
            >
              <span className={`flex items-center justify-center h-full w-full rounded-full px-5 py-1.5 text-[15px] font-medium transition-colors ${activeTab === 'Copilot' ? 'bg-[#121821] text-[#e6edf3]' : 'bg-black text-[#e6edf3]'}`}>
                Copilot
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="relative flex items-center px-3 py-1.5 bg-black/40 border border-[#1f2a36] rounded-full shadow-inner">
            <Search size={14} className="text-[#7a8a9c] mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-28 placeholder-[#7a8a9c] text-[#e6edf3]"
            />
          </div>
          
          <button onClick={handleMinimize} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#7a8a9c] hover:text-[#e6edf3]"><Minus size={16} /></button>
          <button onClick={handleMaximize} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#7a8a9c] hover:text-[#e6edf3]"><Maximize2 size={16} /></button>
          <button onClick={handleClose} className="p-2 hover:bg-[#ff4d6d]/20 hover:text-[#ff4d6d] rounded-full transition-colors text-[#7a8a9c]"><X size={16} /></button>
        </div>
      </div>

      {/* Ticker Tape */}
      <div className="w-full bg-[#121821]/80 backdrop-blur-md border-y border-[#1f2a36] flex items-center overflow-hidden shrink-0 h-7" style={{ WebkitAppRegion: 'no-drag' } as any}>
         <div className="flex whitespace-nowrap animate-marquee gap-12 font-mono text-[10px] uppercase font-bold px-4">
            <span className="text-[#e6edf3]">RELIANCE.NS <span className="text-[#3ddc97]">▲ 1.2%</span></span>
            <span className="text-[#e6edf3]">HDFCBANK.NS <span className="text-[#3ddc97]">▲ 0.8%</span></span>
            <span className="text-[#e6edf3]">INFY.NS <span className="text-[#ff4d6d]">▼ 1.1%</span></span>
            <span className="text-[#e6edf3]">TCS.NS <span className="text-[#ff4d6d]">▼ 0.4%</span></span>
            <span className="text-[#e6edf3]">ITC.NS <span className="text-[#3ddc97]">▲ 0.1%</span></span>
            <span className="text-[#e6edf3]">BRENT <span className="text-[#ff4d6d]">▲ 1.4%</span></span>
            <span className="text-[#e6edf3]">USDINR <span className="text-[#3ddc97]">▼ 0.1%</span></span>
            <span className="text-[#e6edf3]">NIFTY <span className="text-[#ff4d6d]">▼ 2.1%</span></span>
            {/* Duplicate for infinite effect */}
            <span className="text-[#e6edf3] ml-12">RELIANCE.NS <span className="text-[#3ddc97]">▲ 1.2%</span></span>
            <span className="text-[#e6edf3]">HDFCBANK.NS <span className="text-[#3ddc97]">▲ 0.8%</span></span>
            <span className="text-[#e6edf3]">INFY.NS <span className="text-[#ff4d6d]">▼ 1.1%</span></span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 overflow-hidden relative z-10">
        {activeTab.startsWith('Overview') && <OverviewWorkspace />}
        {activeTab.startsWith('Copilot') && <CopilotWorkspace />}
        {activeTab.startsWith('Scenarios') && <RiskWorkspace />}
        {activeTab.startsWith('Monitor') && <AlertsWorkspace />}
      </div>
      </div>
    </BrailleTerrainBackground>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 1: OVERVIEW
// -----------------------------------------------------------------------------
function OverviewWorkspace() {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-3">
      <Panel defaultSize={35} minSize={20}>
        <PanelGroup direction="vertical" className="gap-3">
          <Panel defaultSize={60}>
            <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden">
              <div className="px-3 py-2 border-b border-[#1f2a36] flex justify-between items-center bg-black/40">
                <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍PORTFOLIO OVERVIEW</span>
                <span className="text-[#3ddc97] font-mono font-bold bg-[#3ddc97]/10 px-2 py-0.5 border border-[#3ddc97]/20">₹1.50 Cr</span>
              </div>
              <div className="flex-1 overflow-auto p-3">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="sticky top-0 bg-[#121821] text-[#7a8a9c] uppercase">
                    <tr>
                      <th className="font-normal p-2 border-b border-[#1f2a36]">Ticker</th>
                      <th className="font-normal p-2 text-right border-b border-[#1f2a36]">Weight</th>
                      <th className="font-normal p-2 text-right border-b border-[#1f2a36]">Price</th>
                      <th className="font-normal p-2 text-right border-b border-[#1f2a36]">24h Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: 'RELIANCE', w: '12.5%', p: '2,850.40', c: '+1.24%', up: true, tag: 'Energy' },
                      { t: 'TCS', w: '9.8%', p: '3,892.10', c: '-0.45%', up: false, tag: 'Tech' },
                      { t: 'HDFCBANK', w: '15.2%', p: '1,432.00', c: '+0.89%', up: true, tag: 'Finance' },
                      { t: 'INFY', w: '7.4%', p: '1,421.90', c: '-1.12%', up: false, tag: 'Tech' },
                      { t: 'ITC', w: '5.1%', p: '412.30', c: '+0.10%', up: true, tag: 'Consumer' },
                    ].map(row => (
                      <tr key={row.t} className="hover:bg-white/5 cursor-pointer transition-colors border-b border-[#1f2a36] last:border-0">
                        <td className="p-2">
                          <div className="font-bold text-white">{row.t}</div>
                          <div className="text-[9px] text-[#7a8a9c] bg-[#1f2a36] inline-block px-1 mt-1 uppercase">{row.tag}</div>
                        </td>
                        <td className="p-2 text-right text-[#e6edf3]">{row.w}</td>
                        <td className="p-2 text-right text-[#e6edf3]">{row.p}</td>
                        <td className={`p-2 text-right font-bold ${row.up ? 'text-[#3ddc97]' : 'text-[#ff4d6d]'}`}>{row.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1.5 bg-transparent relative group">
             <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
          </PanelResizeHandle>
          <Panel defaultSize={40}>
            <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden">
              <div className="px-3 py-2 border-b border-[#1f2a36] bg-black/40">
                <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍LIVE INTELLIGENCE</span>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-3 font-mono">
                 <SentimentItem time="13:04" type="NEG" score="-0.82" src="Reuters" text="Unexpected monsoon delay raises FMCG inflation fears." />
                 <SentimentItem time="12:45" type="POS" score="+0.91" src="BBG" text="Reliance unveils massive green energy capex plan in Gujarat." />
                 <SentimentItem time="11:30" type="WARN" score="-0.45" src="Local" text="Mumbai port congestion affecting engineering exports." />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-transparent relative group">
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
      </PanelResizeHandle>
      <Panel defaultSize={65}>
        <PanelGroup direction="vertical" className="gap-3">
          <Panel defaultSize={70}>
            <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col relative shadow-2xl overflow-hidden">
              <div className="absolute top-3 left-3 z-10 flex gap-2 font-mono">
                <select className="bg-black/80 text-white text-[10px] px-2 py-1 border border-[#1f2a36] outline-none uppercase"><option>RELIANCE (1D)</option></select>
                <div className="flex gap-2 text-[10px]">
                  <button className="bg-[#1f2a36] text-white px-2 py-1 uppercase">Volume</button>
                  <button className="bg-[#3ddc97]/10 text-[#3ddc97] border border-[#3ddc97]/30 px-2 py-1 uppercase">Rain Anomaly Overlay</button>
                </div>
              </div>
              <div className="flex-1 w-full mt-4" style={{ minHeight: 0 }}>
                <LightweightChartPlaceholder />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1.5 bg-transparent relative group">
             <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
          </PanelResizeHandle>
          <Panel defaultSize={30}>
            <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden">
              <div className="px-3 py-2 border-b border-[#1f2a36] bg-black/40">
                <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍MACRO VARIABLES</span>
              </div>
              <div className="flex-1 p-3 grid grid-cols-3 gap-3 overflow-auto font-mono">
                <div className="bg-black/40 border border-[#1f2a36] p-3 flex flex-col justify-between">
                  <div className="text-[10px] text-[#7a8a9c] uppercase">USD/INR</div>
                  <div>
                    <div className="text-xl font-bold text-[#e6edf3]">83.12 <span className="text-[10px] font-normal text-[#3ddc97] bg-[#3ddc97]/10 px-1 ml-1">-0.05</span></div>
                  </div>
                  <div className="h-8 mt-2 opacity-80"><Sparkline color="#3ddc97" /></div>
                </div>
                <div className="bg-black/40 border border-[#1f2a36] p-3 flex flex-col justify-between">
                  <div className="text-[10px] text-[#7a8a9c] uppercase">BRENT CRUDE</div>
                  <div>
                    <div className="text-xl font-bold text-[#e6edf3]">$84.50 <span className="text-[10px] font-normal text-[#ff4d6d] bg-[#ff4d6d]/10 px-1 ml-1">+1.20</span></div>
                  </div>
                  <div className="h-8 mt-2 opacity-80"><Sparkline color="#ff4d6d" reverse /></div>
                </div>
                <div className="bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,122,26,0.05)_10px,rgba(255,122,26,0.05)_20px)] border border-[#ff7a1a]/30 p-3 relative overflow-hidden flex flex-col justify-center bg-[#121821]">
                  <AlertTriangle size={60} className="absolute -right-4 -bottom-4 text-[#ff7a1a]/10" />
                  <div className="text-[10px] text-[#ff7a1a] font-bold flex items-center gap-1.5 mb-2 bg-[#ff7a1a]/10 w-max px-2 py-0.5 border border-[#ff7a1a]/20"><AlertTriangle size={10} /> SYSTEM ALERT</div>
                  <div className="text-xs font-semibold text-[#e6edf3] leading-tight">Cyclone Warning: Gujarat Coastline</div>
                  <div className="text-[10px] text-[#7a8a9c] mt-2">Impact: <span className="text-white font-medium bg-[#1f2a36] px-1">RELIANCE</span> <span className="text-white font-medium bg-[#1f2a36] px-1">ADANIPORTS</span></div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}

function SentimentItem({time, type, score, src, text}: {time: string, type: string, score: string, src: string, text: string}) {
  const color = type === 'POS' ? 'text-[#3ddc97] bg-[#3ddc97]/10 border-[#3ddc97]/20' : 
                type === 'NEG' ? 'text-[#ff4d6d] bg-[#ff4d6d]/10 border-[#ff4d6d]/20' : 
                'text-[#ffb000] bg-[#ffb000]/10 border-[#ffb000]/20';
  return (
    <div className="text-[11px] leading-relaxed border-l-2 border-[#1f2a36] pl-2 font-mono">
      <div className="flex gap-2 items-center mb-0.5">
        <span className="text-[#7a8a9c] text-[10px]">{time}</span>
        <span className={`px-1 border text-[9px] font-bold ${color}`}>{type} {score}</span>
        <span className="text-[#7a8a9c] text-[9px] uppercase">{src}</span>
      </div>
      <div className="text-[#e6edf3] font-sans">{text}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 2: COPILOT
// -----------------------------------------------------------------------------
const initialNodes = [
  { id: '1', position: { x: 400, y: 0 }, data: { label: 'parse_intent' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '2', position: { x: 400, y: 60 }, data: { label: 'router' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '3', position: { x: 50, y: 140 }, data: { label: 'sentiment' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#ffb000] px-3 py-2 font-mono rounded-none uppercase shadow-[0_0_8px_rgba(255,176,0,0.3)]' },
  { id: '4', position: { x: 190, y: 140 }, data: { label: 'weather' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#3ddc97] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '5', position: { x: 330, y: 140 }, data: { label: 'agri' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#3ddc97] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '6', position: { x: 470, y: 140 }, data: { label: 'macro' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#3ddc97] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '7', position: { x: 610, y: 140 }, data: { label: 'analog' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#3ddc97] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '8', position: { x: 750, y: 140 }, data: { label: 'exposure' }, className: 'bg-[#121821] text-[#7a8a9c] text-[10px] border border-[#1f2a36] border-dashed px-3 py-2 font-mono rounded-none uppercase' },
  { id: '9', position: { x: 400, y: 220 }, data: { label: 'join' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '10', position: { x: 400, y: 280 }, data: { label: 'quant_agent' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '11', position: { x: 400, y: 340 }, data: { label: 'synthesizer' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '12', position: { x: 250, y: 340 }, data: { label: 'red_team' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
  { id: '13', position: { x: 550, y: 340 }, data: { label: 'validator' }, className: 'bg-[#121821] text-[#e6edf3] text-[10px] border border-[#1f2a36] px-3 py-2 font-mono rounded-none uppercase' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3ddc97' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#ffb000' } },
  { id: 'e2-4', source: '2', target: '4', animated: false, style: { stroke: '#3ddc97' } },
  { id: 'e2-5', source: '2', target: '5', animated: false, style: { stroke: '#3ddc97' } },
  { id: 'e2-6', source: '2', target: '6', animated: false, style: { stroke: '#3ddc97' } },
  { id: 'e2-7', source: '2', target: '7', animated: false, style: { stroke: '#3ddc97' } },
  { id: 'e2-8', source: '2', target: '8', animated: false, style: { stroke: '#1f2a36', strokeDasharray: '4' } },
  { id: 'e3-9', source: '3', target: '9', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e4-9', source: '4', target: '9', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e5-9', source: '5', target: '9', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e6-9', source: '6', target: '9', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e7-9', source: '7', target: '9', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e9-10', source: '9', target: '10', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e10-11', source: '10', target: '11', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e10-12', source: '10', target: '12', animated: false, style: { stroke: '#1f2a36' } },
  { id: 'e10-13', source: '10', target: '13', animated: false, style: { stroke: '#1f2a36' } },
];

function CopilotWorkspace() {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-3">
      <Panel defaultSize={45}>
        <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="px-3 py-2 border-b border-[#1f2a36] flex items-center justify-between bg-black/40">
            <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍AGENT GRAPH · run_mock_8f2a</span>
          </div>
          <div className="flex-1 relative bg-transparent">
            <ReactFlow 
              nodes={nodes} 
              edges={initialEdges} 
              fitView 
              proOptions={{ hideAttribution: true }}
              colorMode="dark"
            >
              <Background color="rgba(255,255,255,0.02)" gap={16} size={1} />
            </ReactFlow>
          </div>
          <div className="h-40 border-t border-[#1f2a36] bg-black/60 p-3 overflow-auto font-mono text-[10px] text-[#7a8a9c] space-y-1.5">
             <div className="flex justify-between items-center pb-2 border-b border-[#1f2a36] mb-2">
               <span className="text-[#e6edf3] uppercase font-bold">Intent Decomposition</span>
             </div>
             <div><span className="text-zinc-500 w-24 inline-block">Intent</span> <span className="text-[#3ddc97]">event_impact</span></div>
             <div><span className="text-zinc-500 w-24 inline-block">Event Type</span> <span className="text-[#e6edf3]">cyclone</span></div>
             <div><span className="text-zinc-500 w-24 inline-block">Tickers</span> <span className="bg-[#1f2a36] px-1 text-white">RELIANCE.NS</span> <span className="bg-[#1f2a36] px-1 text-white">ONGC.NS</span></div>
             <div><span className="text-zinc-500 w-24 inline-block">Needs Tools</span> <span className="text-[#ffb000]">sentiment</span> <span className="text-[#7a8a9c] line-through">exposure</span></div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-transparent relative group">
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
      </PanelResizeHandle>
      <Panel defaultSize={55}>
        <div className="h-full flex flex-col gap-3">
          <div className="flex-1 bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="px-3 py-2 border-b border-[#1f2a36] flex justify-between items-center bg-black/40">
              <div className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍FINAL ANSWER</div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Confidence</span>
                <span className="text-[10px] text-[#121821] bg-[#3ddc97] font-bold px-2 py-0.5 uppercase">HIGH</span>
              </div>
            </div>
            <div className="p-5 overflow-auto text-[14px] leading-relaxed text-[#e6edf3] font-sans">
              <p className="mb-5 border-l-2 border-[#ffb000] pl-3">
                Based on the active Cyclone Warning in Gujarat and rising Brent Crude prices, <span className="bg-[#1f2a36] font-mono text-white px-1">RELIANCE.NS</span> faces a short-term margin compression risk of <span className="text-[#ff4d6d] font-mono font-medium">4.2%</span> <span className="text-[10px] text-[#ffb000] bg-[#ffb000]/10 px-1 ml-1 border border-[#ffb000]/20">[ev_ledger_94a]</span>.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/40 border border-[#1f2a36] p-3">
                  <div className="text-[10px] font-mono text-zinc-500 mb-1 uppercase">Validator Badge</div>
                  <div className="text-[#3ddc97] font-mono text-xs flex items-center gap-2"><CheckCircle2 size={12}/> Numbers Ledger 14/14 ✓</div>
                </div>
                <div className="bg-[#ff4d6d]/5 border border-[#ff4d6d]/20 p-3">
                  <div className="text-[10px] font-mono text-[#ff4d6d] mb-1 flex items-center gap-1 uppercase"><ShieldCheck size={12}/> Red Team</div>
                  <div className="text-[#e6edf3] text-xs">Historical analog from 2019 suggests downstream refining margins may expand post-cyclone.</div>
                </div>
              </div>

              <h3 className="font-bold mb-3 text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍Hedge Proposal</h3>
              <div className="w-full overflow-hidden border border-[#1f2a36]">
                <table className="w-full text-left border-collapse text-xs font-mono">
                   <thead className="bg-[#1f2a36]/50 text-[#7a8a9c] text-[10px] uppercase">
                     <tr><th className="p-2 font-normal">Instrument</th><th className="p-2 font-normal">Side</th><th className="p-2 font-normal">Qty</th><th className="p-2 font-normal text-right">Action</th></tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-[#1f2a36]">
                       <td className="p-2 text-white">RELIANCE 2800 PE</td>
                       <td className="p-2 text-[#3ddc97]">BUY</td>
                       <td className="p-2">1,200</td>
                       <td className="p-2 text-right">
                         <button className="bg-[#ffb000] text-[#121821] hover:bg-[#ffb000]/90 px-3 py-1 text-[10px] font-bold uppercase transition-colors">Approve → Paper</button>
                       </td>
                     </tr>
                   </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] px-3 py-2 flex items-center gap-3 shadow-2xl relative">
             <div className="text-[#ffb000] animate-pulse">▍</div>
             <input 
               type="text" 
               className="flex-1 bg-transparent border-none outline-none text-[13px] placeholder-[#7a8a9c] text-[#e6edf3] font-mono" 
               placeholder="Enter query..."
               defaultValue="Analyze RELIANCE exposure to the active Gujarat cyclone."
             />
             <div className="flex gap-2 items-center border-l border-[#1f2a36] pl-3">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-mono text-[#7a8a9c] uppercase">Cloud 2 · Local 7 · Saved 5</span>
                  <div className="flex gap-0.5 mt-0.5">
                    <div className="h-1.5 w-4 bg-[#3ddc97]"></div><div className="h-1.5 w-4 bg-[#3ddc97]"></div><div className="h-1.5 w-4 bg-[#ffb000]"></div><div className="h-1.5 w-4 bg-[#1f2a36]"></div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 3: SCENARIOS & RISK
// -----------------------------------------------------------------------------
function RiskWorkspace() {
  const dummyData = [
    { name: 'Day 1', p5: -120000, p25: -50000, p50: 10000, p75: 60000, p95: 140000 },
    { name: 'Day 2', p5: -180000, p25: -70000, p50: 15000, p75: 85000, p95: 190000 },
    { name: 'Day 3', p5: -250000, p25: -100000, p50: 12000, p75: 110000, p95: 250000 },
    { name: 'Day 4', p5: -310000, p25: -130000, p50: 18000, p75: 140000, p95: 310000 },
    { name: 'Day 5', p5: -400000, p25: -160000, p50: 22000, p75: 180000, p95: 390000 },
  ];

  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-3">
      <Panel defaultSize={30}>
        <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden font-mono">
          <div className="px-3 py-2 border-b border-[#1f2a36] bg-black/40">
            <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍WHAT-IF SLIDERS</span>
          </div>
          <div className="flex-1 p-4 space-y-5 overflow-auto">
             <div>
               <div className="flex justify-between text-[10px] text-[#7a8a9c] uppercase mb-2"><span>Crude Oil %</span> <span className="text-[#e6edf3]">+10.0%</span></div>
               <input type="range" className="w-full accent-[#ffb000]" min="-30" max="30" defaultValue="10" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] text-[#7a8a9c] uppercase mb-2"><span>USD/INR %</span> <span className="text-[#e6edf3]">+2.0%</span></div>
               <input type="range" className="w-full accent-[#ffb000]" min="-5" max="5" defaultValue="2" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] text-[#7a8a9c] uppercase mb-2"><span>NIFTY %</span> <span className="text-[#e6edf3]">-3.0%</span></div>
               <input type="range" className="w-full accent-[#ffb000]" min="-15" max="15" defaultValue="-3" />
             </div>
             <div>
               <div className="flex justify-between text-[10px] text-[#7a8a9c] uppercase mb-2"><span>Monsoon Rain %</span> <span className="text-[#ff4d6d]">-20.0%</span></div>
               <input type="range" className="w-full accent-[#ff4d6d]" min="-40" max="20" defaultValue="-20" />
             </div>
             
             <div className="mt-8 p-3 border border-[#1f2a36] bg-black/20">
               <div className="text-[10px] text-[#7a8a9c] uppercase mb-1">Simulated P&L</div>
               <div className="text-2xl text-[#ff4d6d] font-bold">-₹18,450.00</div>
               <div className="text-[10px] text-[#ff4d6d]">-1.23%</div>
               
               <div className="mt-3 space-y-1">
                 <div className="flex justify-between text-[10px]"><span className="text-[#e6edf3]">RELIANCE.NS</span> <span className="text-[#ff4d6d]">-9200</span></div>
                 <div className="flex justify-between text-[10px]"><span className="text-[#e6edf3]">ONGC.NS</span> <span className="text-[#3ddc97]">+6100</span></div>
                 <div className="flex justify-between text-[10px]"><span className="text-[#e6edf3]">ITC.NS</span> <span className="text-[#ff4d6d]">-1500</span></div>
               </div>
             </div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-transparent relative group">
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
      </PanelResizeHandle>
      <Panel defaultSize={40}>
        <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden font-mono">
           <div className="px-3 py-2 border-b border-[#1f2a36] bg-black/40 flex justify-between items-center">
             <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍SECTOR HEATMAP</span>
           </div>
           <div className="flex-1 flex flex-col p-4">
             <div className="grid grid-cols-6 text-[9px] text-[#7a8a9c] uppercase mb-2 text-center">
               <div className="text-left">Sector</div><div>Weather</div><div>Agri</div><div>Crude</div><div>Rates</div><div>USD/INR</div>
             </div>
             <div className="space-y-1 flex-1">
               <div className="grid grid-cols-6 h-8 gap-1">
                 <div className="text-[10px] text-[#e6edf3] flex items-center">Energy (38%)</div>
                 <div className="bg-[#3ddc97]/60 flex items-center justify-center text-white text-[9px]">0.6</div>
                 <div className="bg-[#3ddc97]/10 flex items-center justify-center text-white text-[9px]">0.1</div>
                 <div className="bg-[#3ddc97]/80 flex items-center justify-center text-white text-[9px]">0.8</div>
                 <div className="bg-[#ff4d6d]/20 flex items-center justify-center text-white text-[9px]">-0.2</div>
                 <div className="bg-[#3ddc97]/30 flex items-center justify-center text-white text-[9px]">0.3</div>
               </div>
               <div className="grid grid-cols-6 h-8 gap-1">
                 <div className="text-[10px] text-[#e6edf3] flex items-center">FMCG (27%)</div>
                 <div className="bg-[#3ddc97]/30 flex items-center justify-center text-white text-[9px]">0.3</div>
                 <div className="bg-[#3ddc97]/50 flex items-center justify-center text-white text-[9px]">0.5</div>
                 <div className="bg-[#ff4d6d]/20 flex items-center justify-center text-white text-[9px]">-0.2</div>
                 <div className="bg-[#ff4d6d]/10 flex items-center justify-center text-white text-[9px]">-0.1</div>
                 <div className="bg-[#ff4d6d]/10 flex items-center justify-center text-white text-[9px]">-0.1</div>
               </div>
               <div className="grid grid-cols-6 h-8 gap-1">
                 <div className="text-[10px] text-[#e6edf3] flex items-center">Agri (15%)</div>
                 <div className="bg-[#3ddc97]/70 flex items-center justify-center text-white text-[9px]">0.7</div>
                 <div className="bg-[#3ddc97]/90 flex items-center justify-center text-white text-[9px]">0.9</div>
                 <div className="bg-[#ff4d6d]/10 flex items-center justify-center text-white text-[9px]">-0.1</div>
                 <div className="bg-black/20 flex items-center justify-center text-[#7a8a9c] text-[9px]">0.0</div>
                 <div className="bg-[#3ddc97]/10 flex items-center justify-center text-white text-[9px]">0.1</div>
               </div>
               <div className="grid grid-cols-6 h-8 gap-1">
                 <div className="text-[10px] text-[#e6edf3] flex items-center">Banks (20%)</div>
                 <div className="bg-black/20 flex items-center justify-center text-[#7a8a9c] text-[9px]">0.0</div>
                 <div className="bg-[#3ddc97]/10 flex items-center justify-center text-white text-[9px]">0.1</div>
                 <div className="bg-[#ff4d6d]/10 flex items-center justify-center text-white text-[9px]">-0.1</div>
                 <div className="bg-[#3ddc97]/60 flex items-center justify-center text-white text-[9px]">0.6</div>
                 <div className="bg-[#ff4d6d]/20 flex items-center justify-center text-white text-[9px]">-0.2</div>
               </div>
             </div>
           </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 bg-transparent relative group">
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#1f2a36] group-hover:bg-[#ffb000] transition-colors" />
      </PanelResizeHandle>
      <Panel defaultSize={30}>
        <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden font-mono">
          <div className="px-3 py-2 border-b border-[#1f2a36] bg-black/40">
            <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍MONTE CARLO P&L</span>
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <div className="text-[10px] text-[#7a8a9c] uppercase mb-1">Value at Risk (95%)</div>
                  <div className="text-2xl text-[#ff4d6d] font-bold tracking-tight">-₹3.45L</div>
               </div>
               <div className="text-[10px] text-[#7a8a9c]">2.3% of portfolio</div>
            </div>
            <div className="flex-1 min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{fontSize: 9, fill: '#7a8a9c', fontFamily: 'monospace'}} stroke="#1f2a36" axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 9, fill: '#7a8a9c', fontFamily: 'monospace'}} stroke="#1f2a36" axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#0b0f14', border: '1px solid #1f2a36', borderRadius: '0px', fontFamily: 'monospace', fontSize: '10px'}} itemStyle={{color: '#e6edf3'}} />
                  <Area type="step" dataKey="p95" stroke="none" fill="#ffb000" fillOpacity={0.1} />
                  <Area type="step" dataKey="p5" stroke="none" fill="#ff4d6d" fillOpacity={0.1} />
                  <Area type="step" dataKey="p75" stroke="none" fill="#ffb000" fillOpacity={0.2} />
                  <Area type="step" dataKey="p25" stroke="none" fill="#ff4d6d" fillOpacity={0.2} />
                  <Line type="step" dataKey="p50" stroke="#e6edf3" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 4: ALERTS
// -----------------------------------------------------------------------------
function AlertsWorkspace() {
  return (
    <div className="h-full bg-[#121821]/90 backdrop-blur-md border border-[#1f2a36] flex flex-col shadow-2xl overflow-hidden font-mono">
       <div className="px-3 py-2 bg-black/40 border-b border-[#1f2a36]">
         <span className="font-bold text-[#e6edf3] font-display uppercase tracking-widest text-[10px]">▍SYSTEM ALERTS & MONITORING</span>
       </div>
       <div className="flex-1 overflow-auto p-3">
         <table className="w-full text-left border-collapse text-xs">
            <thead className="text-[#7a8a9c] uppercase bg-[#1f2a36]/50">
              <tr>
                <th className="p-3 font-normal">Time</th>
                <th className="p-3 font-normal">Severity</th>
                <th className="p-3 font-normal">Asset</th>
                <th className="p-3 font-normal">Trigger</th>
                <th className="p-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#1f2a36] hover:bg-white/5 transition-colors">
                <td className="p-3 text-[#7a8a9c]">12:30 PM</td>
                <td className="p-3"><span className="bg-[#ff4d6d]/10 text-[#ff4d6d] px-2 py-0.5 border border-[#ff4d6d]/20 uppercase">High</span></td>
                <td className="p-3 text-[#e6edf3] font-bold">RELIANCE</td>
                <td className="p-3 text-[#e6edf3]">Cyclone warning mapped to Gujarat refinery assets. Margin risk detected.</td>
                <td className="p-3 text-right"><button className="text-[10px] uppercase bg-[#1f2a36] text-white px-3 py-1.5 hover:bg-[#1f2a36]/80 transition-colors">Acknowledge</button></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors border-b border-[#1f2a36]">
                <td className="p-3 text-[#7a8a9c]">11:15 AM</td>
                <td className="p-3"><span className="bg-[#ffb000]/10 text-[#ffb000] px-2 py-0.5 border border-[#ffb000]/20 uppercase">Med</span></td>
                <td className="p-3 text-[#e6edf3] font-bold">HDFCBANK</td>
                <td className="p-3 text-[#e6edf3]">Volume breakout > 3x 20DMA detected on options chain.</td>
                <td className="p-3 text-right text-[#7a8a9c]">Dismissed</td>
              </tr>
            </tbody>
         </table>
       </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------

function Sparkline({ color, reverse }: { color: string, reverse?: boolean }) {
  const data = Array.from({length: 20}, () => Math.random() * 10 + (reverse ? 20 : 10));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((v, i) => ({i, v}))}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function LightweightChartPlaceholder() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#666' },
      grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
      timeScale: { borderColor: '#333' },
      rightPriceScale: { borderColor: '#333' },
      crosshair: { mode: 1 },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#2dd4bf', downColor: '#ef4444', borderVisible: false,
      wickUpColor: '#2dd4bf', wickDownColor: '#ef4444'
    });

    // Dummy data
    const data = [];
    let time = Math.floor(Date.now() / 1000) - 100 * 86400;
    let price = 2500;
    for(let i=0; i<100; i++) {
      const open = price + (Math.random() * 40 - 20);
      const close = open + (Math.random() * 60 - 30);
      const high = Math.max(open, close) + Math.random() * 20;
      const low = Math.min(open, close) - Math.random() * 20;
      data.push({ time: time as any, open, high, low, close });
      price = close;
      time += 86400;
    }
    candlestickSeries.setData(data);

    // Weather overlay simulation (background color band)
    const lineSeries = chart.addLineSeries({ color: '#f59e0b', lineWidth: 1, lineStyle: 2 });
    const lineData = data.map(d => ({ time: d.time, value: 2700 + Math.random()*100 }));
    lineSeries.setData(lineData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
