'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Settings, Maximize2, X, Minus, Bell, Activity, Search, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, Play } from 'lucide-react';
import { createChart } from 'lightweight-charts';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-300 font-mono text-[11px] overflow-hidden selection:bg-teal-500/30">
      {/* Title Bar - Draggable */}
      <div 
        className="flex items-center justify-between px-3 h-9 bg-[#111] border-b border-zinc-800"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold text-amber-500 text-sm tracking-wider">UTSAVA</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{time}</span>
          
          <div className="flex items-center gap-2 text-[10px] ml-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <div className={`px-2 py-0.5 rounded font-bold ${
              health === 'LIVE' ? 'bg-teal-500/20 text-teal-400' :
              health === 'DEGRADED' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {health}
            </div>
            <div className="text-zinc-500 flex items-center gap-1"><Activity size={10} /> {latency}ms</div>
          </div>
        </div>

        <div className="flex gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {['Overview', 'Copilot', 'Risk & Scenarios', 'Alerts & Monitor', 'Proof'].map((tab, i) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[11px] rounded-t-sm transition-colors border-t-2 ${activeTab === tab ? 'bg-[#1a1a1a] text-amber-400 border-amber-500' : 'text-zinc-500 border-transparent hover:bg-zinc-800'}`}
            >
              {i+1}: {tab.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="relative flex items-center px-2 py-1 bg-zinc-800 rounded">
            <Search size={12} className="text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="/ command..." 
              className="bg-transparent border-none outline-none text-[11px] w-32 placeholder-zinc-600"
            />
          </div>
          
          <button className="p-1.5 hover:bg-zinc-800 rounded relative">
            <Bell size={13} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <button className="p-1.5 hover:bg-zinc-800 rounded"><Settings size={13} /></button>
          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
          <button onClick={handleMinimize} className="p-1.5 hover:bg-zinc-800 rounded"><Minus size={13} /></button>
          <button onClick={handleMaximize} className="p-1.5 hover:bg-zinc-800 rounded"><Maximize2 size={13} /></button>
          <button onClick={handleClose} className="p-1.5 hover:bg-red-500 hover:text-white rounded"><X size={13} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-1 overflow-hidden bg-[#0a0a0a]">
        {activeTab.startsWith('Overview') && <OverviewWorkspace />}
        {activeTab.startsWith('Copilot') && <CopilotWorkspace />}
        {activeTab.startsWith('Risk') && <RiskWorkspace />}
        {activeTab.startsWith('Alerts') && <AlertsWorkspace />}
        {activeTab.startsWith('Proof') && <div className="p-4 flex items-center justify-center text-zinc-600 h-full border border-zinc-800 rounded">Proof Panel - Backtest & Audit Log</div>}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// WORKSPACE 1: OVERVIEW
// -----------------------------------------------------------------------------
function OverviewWorkspace() {
  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-1">
      <Panel defaultSize={35} minSize={20}>
        <PanelGroup direction="vertical" className="gap-1">
          <Panel defaultSize={60}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col">
              <div className="px-2 py-1.5 bg-[#1a1a1a] text-zinc-300 font-bold border-b border-zinc-800 flex justify-between">
                <span>PORTFOLIO & EXPOSURE</span>
                <span className="text-teal-400">₹1,50,00,000</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#111] text-zinc-500 text-[10px]">
                    <tr>
                      <th className="font-normal p-2 pb-1 border-b border-zinc-800">TICKER</th>
                      <th className="font-normal p-2 pb-1 border-b border-zinc-800 text-right">WEIGHT</th>
                      <th className="font-normal p-2 pb-1 border-b border-zinc-800 text-right">PRICE (INR)</th>
                      <th className="font-normal p-2 pb-1 border-b border-zinc-800 text-right">DAY CHG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: 'RELIANCE', w: '12.5%', p: '2,850.40', c: '+1.24%', up: true, tag: 'Energy' },
                      { t: 'TCS', w: '9.8%', p: '3,892.10', c: '-0.45%', up: false, tag: 'IT' },
                      { t: 'HDFCBANK', w: '15.2%', p: '1,432.00', c: '+0.89%', up: true, tag: 'Fin' },
                      { t: 'INFY', w: '7.4%', p: '1,421.90', c: '-1.12%', up: false, tag: 'IT' },
                      { t: 'ITC', w: '5.1%', p: '412.30', c: '+0.10%', up: true, tag: 'FMCG' },
                    ].map(row => (
                      <tr key={row.t} className="hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50">
                        <td className="p-2 py-1.5">
                          <div className="font-bold text-zinc-300">{row.t}</div>
                          <div className="text-[9px] text-zinc-600 bg-zinc-800 inline-block px-1 rounded">{row.tag}</div>
                        </td>
                        <td className="p-2 text-right text-zinc-400">{row.w}</td>
                        <td className="p-2 text-right">{row.p}</td>
                        <td className={`p-2 text-right ${row.up ? 'text-teal-400' : 'text-red-400'}`}>{row.c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1" />
          <Panel defaultSize={40}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col">
              <div className="px-2 py-1.5 bg-[#1a1a1a] text-zinc-300 font-bold border-b border-zinc-800">SENTIMENT FEED</div>
              <div className="flex-1 overflow-auto p-2 space-y-2">
                 <SentimentItem time="13:04" type="NEG" score="-0.82" src="Reuters" text="Unexpected monsoon delay raises FMCG inflation fears. ITC and HUL under pressure." />
                 <SentimentItem time="12:45" type="POS" score="+0.91" src="BBG" text="Reliance unveils massive green energy capex plan in Gujarat." />
                 <SentimentItem time="11:30" type="WARN" score="-0.45" src="Local" text="Mumbai port congestion affecting engineering exports." />
                 <SentimentItem time="10:15" type="POS" score="+0.75" src="PTI" text="RBI hints at maintaining repo rate, banking sector reacts positively." />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="w-1" />
      <Panel defaultSize={65}>
        <PanelGroup direction="vertical" className="gap-1">
          <Panel defaultSize={70}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col relative">
              <div className="absolute top-2 left-2 z-10 flex gap-2">
                <select className="bg-zinc-800 text-zinc-300 text-[10px] p-1 border-none rounded outline-none"><option>RELIANCE (1D)</option></select>
                <div className="flex gap-1 text-[10px]">
                  <button className="bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded">Volume</button>
                  <button className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 px-2 py-1 rounded border border-amber-500/50">Overlay: Rain Anomaly</button>
                </div>
              </div>
              <div className="flex-1 w-full" style={{ minHeight: 0 }}>
                <LightweightChartPlaceholder />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-1" />
          <Panel defaultSize={30}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col">
              <div className="px-2 py-1.5 bg-[#1a1a1a] text-zinc-300 font-bold border-b border-zinc-800 flex justify-between">
                <span>MACRO & DISASTER OVERLAYS</span>
              </div>
              <div className="flex-1 p-2 grid grid-cols-3 gap-2 overflow-auto">
                <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                  <div className="text-[10px] text-zinc-500 mb-1">USD/INR</div>
                  <div className="text-lg text-teal-400">83.12 <span className="text-[10px]">-0.05</span></div>
                  <div className="h-10 mt-2"><Sparkline color="#2dd4bf" /></div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2 rounded">
                  <div className="text-[10px] text-zinc-500 mb-1">BRENT CRUDE</div>
                  <div className="text-lg text-red-400">$84.50 <span className="text-[10px]">+1.20</span></div>
                  <div className="h-10 mt-2"><Sparkline color="#f87171" reverse /></div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-2 rounded relative overflow-hidden">
                  <AlertTriangle size={40} className="absolute -right-2 -bottom-2 text-red-500/20" />
                  <div className="text-[10px] text-red-400 font-bold flex items-center gap-1 mb-1"><AlertTriangle size={10} /> ACTIVE EVENT</div>
                  <div className="text-sm font-bold text-zinc-200">Cyclone Warning: Gujarat</div>
                  <div className="text-[10px] text-zinc-400 mt-1">Severity: HIGH • Affected: RELIANCE, ADANIPORTS</div>
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
  { id: '1', type: 'input', position: { x: 250, y: 0 }, data: { label: 'Query Intent Parser' }, className: 'bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-600 rounded p-2' },
  { id: '2', position: { x: 100, y: 80 }, data: { label: 'Sentiment Agent' }, className: 'bg-teal-900/50 text-teal-400 text-[10px] border border-teal-500 rounded p-2' },
  { id: '3', position: { x: 400, y: 80 }, data: { label: 'Risk / Macro Agent' }, className: 'bg-amber-900/50 text-amber-400 text-[10px] border border-amber-500 rounded p-2' },
  { id: '4', position: { x: 250, y: 160 }, data: { label: 'Ledger Validator' }, className: 'bg-blue-900/50 text-blue-400 text-[10px] border border-blue-500 rounded p-2' },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#2dd4bf' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#fbbf24' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#3b82f6' } },
];

function CopilotWorkspace() {
  const [nodes, setNodes] = useState(initialNodes);
  
  // Simulate active agent cycling
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setNodes(nds => nds.map((n, i) => ({
        ...n,
        className: n.className.replace(/shadow-\[.*?\]/g, '') + (i === step ? ' shadow-[0_0_10px_rgba(255,255,255,0.3)]' : '')
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PanelGroup direction="horizontal" className="w-full h-full gap-1">
      <Panel defaultSize={30}>
        <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col">
          <div className="px-2 py-1.5 bg-[#1a1a1a] text-zinc-300 font-bold border-b border-zinc-800 flex items-center justify-between">
            <span>MULTI-AGENT EXECUTION</span>
            <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1 rounded border border-amber-500/20">EXPERT MODE</span>
          </div>
          <div className="flex-1 bg-zinc-950 relative">
            <ReactFlow 
              nodes={nodes} 
              edges={initialEdges} 
              fitView 
              proOptions={{ hideAttribution: true }}
              colorMode="dark"
            >
              <Background color="#333" gap={16} size={1} />
            </ReactFlow>
          </div>
          <div className="h-32 border-t border-zinc-800 bg-[#111] p-2 overflow-auto font-mono text-[10px] text-zinc-400 space-y-1">
            <div><span className="text-teal-400">[Sentiment]</span> Extracted FinBERT scores for RELIANCE (0.85)</div>
            <div><span className="text-amber-400">[Macro]</span> Correlating crude oil spikes with historical margins...</div>
            <div className="text-blue-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> [Validator] Verifying ledger entries...</div>
          </div>
        </div>
      </Panel>
      <PanelResizeHandle className="w-1" />
      <Panel defaultSize={70}>
        <div className="h-full flex flex-col gap-1">
          <div className="flex-1 bg-[#111] border border-zinc-800 rounded flex flex-col">
            <div className="px-3 py-2 bg-[#1a1a1a] border-b border-zinc-800 flex justify-between items-center">
              <div className="font-bold">ANALYSIS RESULTS</div>
              <div className="flex gap-2">
                <span className="text-[10px] text-zinc-500">CONFIDENCE:</span>
                <span className="text-[10px] text-teal-400 font-bold">88%</span>
              </div>
            </div>
            <div className="p-4 overflow-auto text-sm leading-relaxed text-zinc-300">
              <p className="mb-4">
                Based on the active Cyclone Warning in Gujarat and rising Brent Crude prices, <span className="bg-zinc-800 text-amber-400 px-1 rounded cursor-pointer border-b border-amber-500/50">RELIANCE</span> faces a short-term margin compression risk of <span className="bg-zinc-800 text-teal-400 px-1 rounded cursor-pointer border-b border-teal-500/50">4.2%</span> <span className="text-[10px] text-zinc-500">(Ref: Ledger #94A)</span>.
              </p>
              <div className="bg-red-500/5 border border-red-500/20 rounded p-3 mb-4">
                <div className="text-red-400 text-[10px] font-bold mb-1 flex items-center gap-1"><ShieldCheck size={12}/> RED TEAM COUNTER-ARGUMENT</div>
                <p className="text-[11px] text-zinc-400">The historical analog from 2019 suggests that downstream refining margins often expand post-cyclone due to regional supply constraints, potentially offsetting upstream disruptions.</p>
              </div>
              <h3 className="font-bold text-[12px] mb-2 text-zinc-100">RECOMMENDED ACTION: HEDGE</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-900 border border-zinc-700 p-2 rounded">
                  <div className="text-[10px] text-zinc-500">INSTRUMENT</div>
                  <div className="font-bold text-amber-400">RELIANCE 2800 PE</div>
                  <div className="text-[10px] text-zinc-400 mt-1">Size: 2% of portfolio</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-700 p-2 rounded flex flex-col justify-center gap-2">
                  <button className="bg-teal-600 hover:bg-teal-500 text-white py-1 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1"><CheckCircle2 size={12}/> APPROVE EXECTUTION</button>
                  <button className="bg-zinc-700 hover:bg-zinc-600 text-white py-1 px-2 rounded text-[11px] font-bold">REJECT</button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-12 bg-[#111] border border-zinc-800 rounded p-1.5 flex items-center gap-2">
             <div className="bg-zinc-800 px-2 py-1.5 rounded text-amber-500"><Play size={14} /></div>
             <input 
               type="text" 
               className="flex-1 bg-transparent border-none outline-none text-sm placeholder-zinc-600 text-zinc-200" 
               placeholder="Ask Copilot: 'What is the downside risk if crude hits $95?'"
               defaultValue="Analyze RELIANCE exposure to the active Gujarat cyclone and rising crude."
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
    <PanelGroup direction="vertical" className="w-full h-full gap-1">
      <Panel defaultSize={50}>
        <PanelGroup direction="horizontal" className="gap-1">
          <Panel defaultSize={30}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col p-3">
              <div className="font-bold text-amber-500 mb-4 text-xs">PORTFOLIO RISK (1D)</div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500">Value at Risk (95%)</div>
                  <div className="text-xl text-red-400 font-bold">-₹3,45,000</div>
                  <div className="text-[10px] text-zinc-500 mt-1">2.3% of portfolio</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">Beta vs NIFTY 50</div>
                  <div className="text-xl text-teal-400 font-bold">1.12</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">Annualized Volatility</div>
                  <div className="text-xl text-amber-400 font-bold">14.5%</div>
                </div>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="w-1" />
          <Panel defaultSize={70}>
            <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col p-2">
              <div className="font-bold text-zinc-400 text-xs mb-2 pl-2">MONTE CARLO P&L SIMULATION (5 DAYS)</div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dummyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 10, fill: '#666'}} stroke="#333" />
                    <YAxis tick={{fontSize: 10, fill: '#666'}} stroke="#333" />
                    <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', fontSize: '10px'}} />
                    <Area type="monotone" dataKey="p95" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p5" stroke="none" fill="#ef4444" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p75" stroke="none" fill="#3b82f6" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="p25" stroke="none" fill="#ef4444" fillOpacity={0.2} />
                    <Line type="monotone" dataKey="p50" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="h-1" />
      <Panel defaultSize={50}>
        <div className="h-full bg-[#111] border border-zinc-800 rounded p-3 text-zinc-500 flex items-center justify-center">
           Correlation Heatmap & Exposure Breakdown (Placeholder)
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
    <div className="h-full bg-[#111] border border-zinc-800 rounded flex flex-col">
       <div className="px-3 py-2 bg-[#1a1a1a] text-zinc-300 font-bold border-b border-zinc-800">SYSTEM ALERTS & MONITORING</div>
       <div className="flex-1 overflow-auto p-2">
         <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-[#111] text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-2 font-normal">TIME</th>
                <th className="p-2 font-normal">TIER</th>
                <th className="p-2 font-normal">TICKERS</th>
                <th className="p-2 font-normal">REASON</th>
                <th className="p-2 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/50">
                <td className="p-2 text-zinc-400">12:30:15</td>
                <td className="p-2"><span className="bg-red-500/20 text-red-400 px-1 rounded font-bold border border-red-500/50">T2</span></td>
                <td className="p-2 text-zinc-300 font-bold">RELIANCE</td>
                <td className="p-2 text-zinc-300">Cyclone warning mapped to Gujarat refinery assets. Margin risk detected.</td>
                <td className="p-2"><button className="text-[9px] bg-zinc-700 px-2 py-0.5 rounded hover:bg-zinc-600">ACKNOWLEDGE</button></td>
              </tr>
              <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/50">
                <td className="p-2 text-zinc-400">11:15:00</td>
                <td className="p-2"><span className="bg-amber-500/20 text-amber-400 px-1 rounded font-bold border border-amber-500/50">T1</span></td>
                <td className="p-2 text-zinc-300 font-bold">HDFCBANK</td>
                <td className="p-2 text-zinc-300">Volume breakout > 3x 20DMA detected on options chain.</td>
                <td className="p-2 text-teal-500">DISMISSED</td>
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
