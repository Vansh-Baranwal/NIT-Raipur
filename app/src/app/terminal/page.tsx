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
          <div className="flex items-center gap-1 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 shadow-2xl">
            {['Overview', 'Scenarios', 'Monitor'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 text-[15px] font-medium rounded-full transition-all duration-300 ${activeTab === tab ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
            
            <button 
              onClick={() => setActiveTab('Copilot')}
              className="relative inline-flex items-center justify-center rounded-full p-[1px] bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-500 ml-1 transition-transform hover:scale-105"
            >
              <span className={`flex items-center justify-center h-full w-full rounded-full px-5 py-1.5 text-[15px] font-medium transition-colors ${activeTab === 'Copilot' ? 'bg-zinc-900/80 text-white' : 'bg-black text-white'}`}>
                Copilot
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="relative flex items-center px-3 py-1.5 bg-black/40 border border-white/5 rounded-full shadow-inner">
            <Search size={14} className="text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-28 placeholder-zinc-500 text-zinc-200"
            />
          </div>
          
          <button onClick={handleMinimize} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"><Minus size={16} /></button>
          <button onClick={handleMaximize} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"><Maximize2 size={16} /></button>
          <button onClick={handleClose} className="p-2 hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors text-zinc-400"><X size={16} /></button>
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
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <span className="font-bold text-white font-display uppercase tracking-widest text-[11px]">Portfolio Overview</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-full text-xs border border-emerald-500/20">₹1.50 Cr</span>
              </div>
              <div className="flex-1 overflow-auto p-2">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-black/40 backdrop-blur-md text-zinc-400 text-xs">
                    <tr>
                      <th className="font-medium p-3 rounded-tl-lg">Ticker</th>
                      <th className="font-medium p-3 text-right">Weight</th>
                      <th className="font-medium p-3 text-right">Price</th>
                      <th className="font-medium p-3 text-right rounded-tr-lg">24h Change</th>
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
                      <tr key={row.t} className="hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0">
                        <td className="p-3">
                          <div className="font-bold text-white">{row.t}</div>
                          <div className="text-[10px] text-zinc-400 bg-white/5 border border-white/10 inline-block px-1.5 py-0.5 rounded-md mt-1">{row.tag}</div>
                        </td>
                        <td className="p-3 text-right text-zinc-300 font-medium">{row.w}</td>
                        <td className="p-3 text-right text-zinc-200">{row.p}</td>
                        <td className={`p-3 text-right font-medium ${row.up ? 'text-emerald-400' : 'text-rose-400'}`}>{row.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
          <Panel defaultSize={40}>
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl">
              <div className="px-4 py-3 border-b border-white/10">
                <span className="font-bold text-white font-display uppercase tracking-widest text-[11px]">Live Intelligence</span>
              </div>
              <div className="flex-1 overflow-auto p-3 space-y-3">
                 <SentimentItem time="13:04" type="NEG" score="-0.82" src="Reuters" text="Unexpected monsoon delay raises FMCG inflation fears." />
                 <SentimentItem time="12:45" type="POS" score="+0.91" src="BBG" text="Reliance unveils massive green energy capex plan in Gujarat." />
                 <SentimentItem time="11:30" type="WARN" score="-0.45" src="Local" text="Mumbai port congestion affecting engineering exports." />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="w-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
      <Panel defaultSize={65}>
        <PanelGroup direction="vertical" className="gap-3">
          <Panel defaultSize={70}>
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col relative shadow-xl overflow-hidden">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <select className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 border border-white/10 rounded-full outline-none"><option>RELIANCE (1D)</option></select>
                <div className="flex gap-2 text-xs">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/5 transition-colors">Volume</button>
                  <button className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 px-3 py-1.5 rounded-full border border-indigo-500/50 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.2)]">Rain Anomaly Overlay</button>
                </div>
              </div>
              <div className="flex-1 w-full mt-4" style={{ minHeight: 0 }}>
                <LightweightChartPlaceholder />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
          <Panel defaultSize={30}>
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl">
              <div className="px-4 py-3 border-b border-white/10">
                <span className="font-bold text-white font-display uppercase tracking-widest text-[11px]">Macro Variables</span>
              </div>
              <div className="flex-1 p-3 grid grid-cols-3 gap-3 overflow-auto">
                <div className="bg-black/20 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-xs text-zinc-400 font-medium">USD/INR</div>
                  <div>
                    <div className="text-2xl font-bold text-white">83.12 <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-1 rounded">-0.05</span></div>
                  </div>
                  <div className="h-8 mt-2 opacity-80"><Sparkline color="#34d399" /></div>
                </div>
                <div className="bg-black/20 border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <div className="text-xs text-zinc-400 font-medium">BRENT CRUDE</div>
                  <div>
                    <div className="text-2xl font-bold text-white">$84.50 <span className="text-xs font-normal text-rose-400 bg-rose-500/10 px-1 rounded">+1.20</span></div>
                  </div>
                  <div className="h-8 mt-2 opacity-80"><Sparkline color="#fb7185" reverse /></div>
                </div>
                <div className="bg-gradient-to-br from-rose-500/20 to-orange-500/10 border border-rose-500/30 p-3 rounded-xl relative overflow-hidden flex flex-col justify-center">
                  <AlertTriangle size={60} className="absolute -right-4 -bottom-4 text-rose-500/20" />
                  <div className="text-xs text-rose-300 font-bold flex items-center gap-1.5 mb-2 bg-rose-500/20 w-max px-2 py-0.5 rounded-full"><AlertTriangle size={12} /> SYSTEM ALERT</div>
                  <div className="text-sm font-semibold text-white leading-tight">Cyclone Warning: Gujarat Coastline</div>
                  <div className="text-xs text-zinc-300 mt-2">Impact: <span className="text-white font-medium">RELIANCE, ADANIPORTS</span></div>
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
  const color = type === 'POS' ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' : 
                type === 'NEG' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 
                'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return (
    <div className="text-[11px] leading-relaxed border-l-2 border-zinc-700 pl-2">
      <div className="flex gap-2 items-center mb-0.5">
        <span className="text-zinc-600">{time}</span>
        <span className={`px-1 rounded border text-[9px] font-bold ${color}`}>{type} {score}</span>
        <span className="text-zinc-500 text-[9px] uppercase">{src}</span>
      </div>
      <div className="text-zinc-300">{text}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 2: COPILOT
// -----------------------------------------------------------------------------
const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Query Intent Parser' }, className: 'bg-white/10 backdrop-blur-md text-white text-xs border border-white/20 rounded-xl p-3 shadow-lg' },
  { id: '2', position: { x: 100, y: 80 }, data: { label: 'Sentiment Agent' }, className: 'bg-emerald-500/10 backdrop-blur-md text-emerald-300 text-xs border border-emerald-500/30 rounded-xl p-3 shadow-lg' },
  { id: '3', position: { x: 400, y: 80 }, data: { label: 'Risk / Macro Agent' }, className: 'bg-amber-500/10 backdrop-blur-md text-amber-300 text-xs border border-amber-500/30 rounded-xl p-3 shadow-lg' },
  { id: '4', position: { x: 250, y: 160 }, data: { label: 'Ledger Validator' }, className: 'bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-xs border border-indigo-500/30 rounded-xl p-3 shadow-lg' },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#34d399' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fbbf24' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#818cf8' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#818cf8' } },
];

function CopilotWorkspace() {
  const [nodes, setNodes] = useState(initialNodes);
  
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setNodes(nds => nds.map((n, i) => ({
        ...n,
        className: n.className.replace(/shadow-\[.*?\]/g, 'shadow-lg') + (i === step ? ' shadow-[0_0_20px_rgba(255,255,255,0.4)] border-white/50' : '')
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-3">
      <Panel defaultSize={30}>
        <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-white font-display uppercase tracking-widest text-[11px]">Execution Graph</span>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">EXPERT MODE</span>
          </div>
          <div className="flex-1 relative bg-black/20">
            <ReactFlow 
              nodes={nodes} 
              edges={initialEdges} 
              fitView 
              proOptions={{ hideAttribution: true }}
              colorMode="dark"
            >
              <Background color="rgba(255,255,255,0.05)" gap={16} size={1} />
            </ReactFlow>
          </div>
          <div className="h-40 border-t border-white/10 bg-black/40 p-4 overflow-auto font-mono text-xs text-zinc-400 space-y-2">
            <div><span className="text-emerald-400 font-bold">[Sentiment]</span> Extracted FinBERT scores for RELIANCE (0.85)</div>
            <div><span className="text-amber-400 font-bold">[Macro]</span> Correlating crude oil spikes with historical margins...</div>
            <div className="text-indigo-400 font-bold flex items-center gap-2 mt-2"><Loader2 size={12} className="animate-spin" /> [Validator] Verifying ledger entries...</div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
      <Panel defaultSize={70}>
        <div className="h-full flex flex-col gap-3">
          <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div className="font-bold text-white font-display uppercase tracking-widest text-[11px]">Copilot Response</div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-zinc-400">Confidence:</span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-full">88%</span>
              </div>
            </div>
            <div className="p-6 overflow-auto text-[15px] leading-relaxed text-zinc-200">
              <p className="mb-6">
                Based on the active Cyclone Warning in Gujarat and rising Brent Crude prices, <span className="bg-white/10 text-white px-1.5 py-0.5 rounded cursor-pointer border-b border-white/20 hover:bg-white/20 transition-colors">RELIANCE</span> faces a short-term margin compression risk of <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded cursor-pointer border-b border-emerald-500/50 hover:bg-emerald-500/30 transition-colors font-medium">4.2%</span> <span className="text-xs text-zinc-500">(Ref: Ledger #94A)</span>.
              </p>
              <div className="bg-gradient-to-r from-rose-500/10 to-transparent border-l-2 border-rose-500 p-4 mb-6 rounded-r-xl">
                <div className="text-rose-400 text-xs font-bold mb-2 flex items-center gap-1.5"><ShieldCheck size={14}/> RED TEAM COUNTER-ARGUMENT</div>
                <p className="text-sm text-zinc-300">The historical analog from 2019 suggests that downstream refining margins often expand post-cyclone due to regional supply constraints, potentially offsetting upstream disruptions.</p>
              </div>
              <h3 className="font-bold mb-3 text-white font-display uppercase tracking-widest text-[11px]">Recommended Action</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 border border-white/10 p-4 rounded-xl shadow-inner">
                  <div className="text-xs text-zinc-400 mb-1">INSTRUMENT</div>
                  <div className="font-bold text-lg text-white">RELIANCE 2800 PE</div>
                  <div className="text-sm text-zinc-400 mt-1">Size: 2% of portfolio</div>
                </div>
                <div className="bg-black/20 border border-white/10 p-4 rounded-xl flex flex-col justify-center gap-3 shadow-inner">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"><CheckCircle2 size={16}/> APPROVE HEDGE</button>
                  <button className="bg-white/5 hover:bg-white/10 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Reject</button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 flex items-center gap-3 shadow-xl">
             <div className="bg-indigo-500 text-white p-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"><Play size={16} className="ml-0.5" /></div>
             <input 
               type="text" 
               className="flex-1 bg-transparent border-none outline-none text-base placeholder-zinc-500 text-white" 
               placeholder="Ask Copilot..."
               defaultValue="Analyze RELIANCE exposure to the active Gujarat cyclone."
             />
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 3: RISK
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
    <PanelGroup direction="vertical" className="w-full h-full gap-3">
      <Panel defaultSize={50}>
        <PanelGroup direction="horizontal" className="gap-3">
          <Panel defaultSize={30}>
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col p-5 shadow-xl">
              <div className="font-semibold text-white mb-6 text-base">Portfolio Risk (1D)</div>
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Value at Risk (95%)</div>
                  <div className="text-3xl text-rose-400 font-bold tracking-tight">-₹3.45L</div>
                  <div className="text-xs text-zinc-500 mt-2">2.3% of portfolio</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Beta vs NIFTY 50</div>
                  <div className="text-2xl text-white font-semibold">1.12</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Annualized Volatility</div>
                  <div className="text-2xl text-white font-semibold">14.5%</div>
                </div>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="w-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
          <Panel defaultSize={70}>
            <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col p-4 shadow-xl">
              <div className="font-semibold text-white mb-4 pl-2">Monte Carlo P&L Simulation (5 Days)</div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#999'}} stroke="#333" axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#999'}} stroke="#333" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)'}} itemStyle={{color: '#fff'}} />
                    <Area type="monotone" dataKey="p95" stroke="none" fill="#6366f1" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p5" stroke="none" fill="#f43f5e" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p75" stroke="none" fill="#6366f1" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="p25" stroke="none" fill="#f43f5e" fillOpacity={0.2} />
                    <Line type="monotone" dataKey="p50" stroke="#fff" strokeWidth={3} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="h-1.5 rounded-full bg-white/5 hover:bg-indigo-500/50 transition-colors" />
      <Panel defaultSize={50}>
        <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col shadow-xl">
           <div className="font-semibold text-white mb-4">Correlation Heatmap</div>
           <div className="flex-1 flex items-center justify-center text-zinc-500 border border-white/5 rounded-xl bg-black/20">
             [ Visualization Placeholder ]
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
    <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden">
       <div className="px-5 py-4 bg-black/20 border-b border-white/10">
         <span className="font-semibold text-white text-lg">System Alerts & Monitoring</span>
       </div>
       <div className="flex-1 overflow-auto p-2">
         <table className="w-full text-left border-collapse">
            <thead className="text-zinc-400 text-xs">
              <tr>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Trigger</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-zinc-400">12:30 PM</td>
                <td className="p-4"><span className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-500/20">HIGH</span></td>
                <td className="p-4 text-white font-medium">RELIANCE</td>
                <td className="p-4 text-zinc-300">Cyclone warning mapped to Gujarat refinery assets. Margin risk detected.</td>
                <td className="p-4 text-right"><button className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors font-medium">Acknowledge</button></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-zinc-400">11:15 AM</td>
                <td className="p-4"><span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-500/20">MED</span></td>
                <td className="p-4 text-white font-medium">HDFCBANK</td>
                <td className="p-4 text-zinc-300">Volume breakout > 3x 20DMA detected on options chain.</td>
                <td className="p-4 text-right text-zinc-500 font-medium">Dismissed</td>
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
